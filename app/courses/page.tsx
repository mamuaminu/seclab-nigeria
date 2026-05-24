'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, getEnrolledCourses, enrollCourse, unenrollCourse, getCourseProgress, setLessonComplete } from '@/app/lib/supabase';
import { COURSES } from '@/app/lib/courseData';

function getUserId() {
  if (typeof window === 'undefined') return 'ssr';
  let id = localStorage.getItem('seclab_user_id');
  if (!id) {
    id = 'anon_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
    localStorage.setItem('seclab_user_id', id);
  }
  return id;
}

function parseLessons(courseId: number): { module: string; lesson: any }[] {
  const course = COURSES.find(c => c.id === courseId);
  if (!course) return [];
  const result: { module: string; lesson: any }[] = [];
  for (const mod of course.modules) {
    for (const lesson of mod.lessons) {
      result.push({ module: mod.title, lesson });
    }
  }
  return result;
}

export default function CoursesPage() {
  const [enrolled, setEnrolled] = useState<number[]>([]);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Record<string, Record<string, boolean>>>({});
  const [loading, setLoading] = useState(true);
  const [activeCourse, setActiveCourse] = useState<number | null>(null);
  const [activeLesson, setActiveLesson] = useState<any | null>(null);
  const [userId, setUserId] = useState('ssr');

  useEffect(() => {
    setUserId(getUserId());
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const ids = await getEnrolledCourses(userId);
      setEnrolled(ids);
      const progress: Record<string, Record<string, boolean>> = {};
      for (const cid of ids) {
        progress[String(cid)] = await getCourseProgress(userId, cid);
      }
      setLessonProgress(progress);
    } catch (e) {
      console.error('Failed to load courses:', e);
    } finally {
      setLoading(false);
    }
  }

  const handleEnroll = useCallback(async (courseId: number) => {
    try {
      await enrollCourse(userId, courseId);
      setEnrolled(prev => [...prev, courseId]);
      setLessonProgress(prev => ({ ...prev, [String(courseId)]: {} }));
    } catch (e) {
      console.error('Failed to enroll:', e);
    }
  }, [userId]);

  const handleUnenroll = useCallback(async (courseId: number) => {
    try {
      await unenrollCourse(userId, courseId);
      setEnrolled(prev => prev.filter(id => id !== courseId));
      if (activeCourse === courseId) {
        setActiveCourse(null);
        setActiveLesson(null);
      }
      setLessonProgress(prev => {
        const next = { ...prev };
        delete next[String(courseId)];
        return next;
      });
    } catch (e) {
      console.error('Failed to unenroll:', e);
    }
  }, [userId, activeCourse]);

  const handleToggleLesson = useCallback(async (courseId: number, lessonKey: string) => {
    const current = lessonProgress[String(courseId)]?.[lessonKey] || false;
    const next = !current;
    try {
      await setLessonComplete(userId, courseId, lessonKey, next);
      setLessonProgress(prev => ({
        ...prev,
        [String(courseId)]: {
          ...(prev[String(courseId)] || {}),
          [lessonKey]: next,
        },
      }));
    } catch (e) {
      console.error('Failed to toggle lesson:', e);
    }
  }, [userId, lessonProgress]);

  function getProgress(courseId: number) {
    const course = COURSES.find(c => c.id === courseId);
    if (!course) return 0;
    let total = 0;
    let done = 0;
    for (const mod of course.modules) {
      for (const lesson of mod.lessons) {
        total++;
        if (lessonProgress[String(courseId)]?.[lesson.key]) done++;
      }
    }
    return total > 0 ? Math.round((done / total) * 100) : 0;
  }

  return (
    <div className="min-h-screen" style={{ background: '#09090b' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6"
        style={{ background: 'rgba(9,9,11,0.9)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1e1e24' }}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.1)"/>
              <path d="M9 14L12 17L19 10" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-display font-bold text-sm" style={{ color: '#f4f4f5' }}>
              Sec<span style={{ color: '#06b6d4' }}>Lab</span><span style={{ color: '#f59e0b' }}>NG</span>
            </span>
          </a>
          <div className="flex items-center gap-6">
            <a href="/ctf" className="nav-link">CTF</a>
            <a href="/courses" className="nav-link" style={{ color: '#f59e0b' }}>Courses</a>
            <a href="/recon" className="nav-link">Recon</a>
          </div>
        </div>
      </nav>

      {/* Two-column layout when a course is active */}
      {/* Mobile lesson panel — full-screen overlay when a course is open */}
      {activeCourse && (
        <div className="md:hidden fixed inset-0 z-40 overflow-y-auto" style={{ background: '#09090b', paddingTop: '64px' }}>
          {/* Sticky back header */}
          <div className="sticky top-0 z-10 flex items-center gap-3 px-4 py-3"
            style={{ background: '#16161c', borderBottom: '1px solid #1e1e24' }}>
            <button
              onClick={() => { setActiveCourse(null); setActiveLesson(null); }}
              className="flex items-center gap-1.5 font-mono text-xs transition-colors"
              style={{ color: '#f59e0b' }}>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
              Back
            </button>
            <span className="font-mono text-xs" style={{ color: '#52525b' }}>|</span>
            <span className="font-mono text-xs truncate flex-1" style={{ color: '#a1a1aa' }}>
              {COURSES.find(c => c.id === activeCourse)?.title}
            </span>
          </div>

          {/* Lesson/module content */}
          <div className="px-4 py-6">
            {(() => {
              const course = COURSES.find(c => c.id === activeCourse);
              if (!course) return null;
              const courseProgress = lessonProgress[String(activeCourse)] || {};

              if (activeLesson) {
              const lessonModule = course.modules.find(m => m.lessons.some(l => l.key === activeLesson.key));
              return (
                <div>
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="flex items-center gap-2 font-mono text-xs mb-5 transition-colors"
                    style={{ color: '#52525b' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Back to modules
                  </button>

                  <div className="flex items-start justify-between gap-4 mb-6">
                    <div>
                      <p className="font-mono text-[10px] mb-2" style={{ color: '#f59e0b' }}>{lessonModule?.title}</p>
                      <h2 className="font-display font-bold text-lg" style={{ color: '#f4f4f5' }}>{activeLesson.title}</h2>
                    </div>
                    <button
                      onClick={() => handleToggleLesson(activeCourse, activeLesson.key)}
                      className="flex-shrink-0 flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-lg transition-all"
                      style={{
                        background: courseProgress[activeLesson.key] ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.08)',
                        color: courseProgress[activeLesson.key] ? '#22c55e' : '#f59e0b',
                        border: courseProgress[activeLesson.key] ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(245,158,11,0.2)',
                      }}>
                      <span>{courseProgress[activeLesson.key] ? '✓ Done' : 'Mark complete'}</span>
                    </button>
                  </div>

                  <div className="prose-content font-mono text-sm leading-relaxed"
                    style={{ color: '#a1a1aa', whiteSpace: 'pre-wrap' }}>
                    {activeLesson.content.split('\n\n').map((para: string, i: number) => {
                      if (para.match(/^\*\*[^*]+\*\*$/)) {
                        return <h3 key={i} className="font-display font-semibold text-base mt-6 mb-3"
                          style={{ color: '#f4f4f5' }}>{para.replace(/\*\*/g, '')}</h3>;
                      }
                      if (para.startsWith('```')) {
                        const code = para.replace(/```[a-z]*\n?/g, '');
                        return <pre key={i} className="rounded-lg p-4 my-4 text-xs overflow-x-auto"
                          style={{ background: '#111116', border: '1px solid #1e1e24', color: '#a1a1aa' }}>{code}</pre>;
                      }
                      const formatted = para.replace(/`([^`]+)`/g, '<code style="background:#1e1e24;padding:1px 5px;border-radius:3px;color:#f59e0b;font-size:0.85em">$1</code>');
                      return <p key={i} className="mb-4 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatted }} />;
                    })}
                  </div>

                  <div className="mt-8 pt-6 flex items-center justify-between"
                    style={{ borderTop: '1px solid #1e1e24' }}>
                    {(() => {
                      const allLessons = course.modules.flatMap(m => m.lessons);
                      const idx = allLessons.findIndex(l => l.key === activeLesson.key);
                      const prev = idx > 0 ? allLessons[idx - 1] : null;
                      const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
                      return (
                        <>
                          {prev ? (
                            <button
                              onClick={() => setActiveLesson(prev)}
                              className="flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-lg"
                              style={{ color: '#52525b', background: '#111116', border: '1px solid #1e1e24' }}>
                              ← {prev.title}
                            </button>
                          ) : <div />}
                          {next ? (
                            <button
                              onClick={() => setActiveLesson(next)}
                              className="flex items-center gap-2 font-mono text-xs px-3 py-2 rounded-lg"
                              style={{ color: '#06b6d4', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                              {next.title} →
                            </button>
                          ) : <div />}
                        </>
                      );
                    })()}
                  </div>
                </div>
              );
              }

              // Course outline
              return (
                <div>
                  <h2 className="font-display font-bold text-lg mb-1" style={{ color: '#f4f4f5' }}>{course.title}</h2>
                  <p className="font-mono text-xs mb-5" style={{ color: '#52525b' }}>
                    {course.modules.length} modules · {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                  </p>

                  <div className="space-y-3">
                    {course.modules.map((mod, mi) => (
                      <div key={mi} className="rounded-xl overflow-hidden"
                        style={{ background: '#111116', border: '1px solid #1e1e24' }}>
                        <div className="px-4 py-3" style={{ borderBottom: '1px solid #1e1e24', background: '#16161c' }}>
                          <p className="font-mono text-xs font-semibold" style={{ color: '#f59e0b' }}>{mod.title}</p>
                          <p className="font-mono text-[10px] mt-0.5" style={{ color: '#52525b' }}>{mod.lessons.length} lessons</p>
                        </div>
                        <div className="divide-y" style={{ borderColor: '#1e1e24' }}>
                          {mod.lessons.map((lesson, li) => {
                            const done = !!courseProgress[lesson.key];
                            return (
                              <button
                                key={li}
                                onClick={() => setActiveLesson(lesson)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                                style={{ background: 'transparent' }}
                                onMouseEnter={e => (e.currentTarget.style.background = '#16161c')}
                                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                                <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                                  style={{ background: done ? '#22c55e' : 'transparent', border: done ? '#22c55e' : '#3f3f46' }}>
                                  {done && <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5L4 7L8 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/></svg>}
                                </div>
                                <p className="flex-1 font-mono text-xs" style={{ color: done ? '#52525b' : '#a1a1aa', textDecoration: done ? 'line-through' : 'none' }}>
                                  {lesson.title}
                                </p>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: '#3f3f46', flexShrink: 0 }}>
                                  <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

      <div className="pt-16 min-h-screen flex flex-col md:flex-row">

        {/* LEFT PANEL — Course List (hidden on mobile when a course is open) */}
        <div className={activeCourse ? 'hidden md:block flex-1 overflow-y-auto' : 'flex-1 overflow-y-auto'}
          style={{
            width: activeCourse ? '380px' : '100%',
            flexShrink: 0,
            borderRight: activeCourse ? '1px solid #1e1e24' : 'none',
            maxHeight: '100vh',
            position: 'sticky',
            top: 0,
          }}>
          {/* HERO */}
          <section className="px-6 pt-10 pb-8" style={{ borderBottom: '1px solid #1e1e24' }}>
            <span className="section-label">// FREE SECURITY TRAINING</span>
            <h1 className="font-display font-bold text-3xl mt-3 mb-2" style={{ color: '#f4f4f5' }}>
              Learn by <span style={{ color: '#f59e0b' }}>breaking</span> things
            </h1>
            <p className="text-sm" style={{ color: '#71717a' }}>
              4 courses · Real content · Progress syncs to the cloud
            </p>
          </section>

          {/* COURSE CARDS */}
          <section className="px-6 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 font-mono text-sm" style={{ color: '#52525b' }}>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1V4M8 12V15M1 8H4M12 8H15M3.05 3.05L5.28 5.28M10.72 10.72L12.95 12.95M3.05 12.95L5.28 10.72M10.72 5.28L12.95 3.05"
                      stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Loading...
                </div>
              </div>
            ) : (
              <div className="space-y-4 pb-8">
                {COURSES.map((course) => {
                  const isEnrolled = enrolled.includes(course.id);
                  const isActive = activeCourse === course.id;
                  const progress = isEnrolled ? getProgress(course.id) : 0;
                  const totalLessons = course.modules.reduce((a, m) => a + m.lessons.length, 0);

                  return (
                    <div key={course.id}
                      className="rounded-xl p-5 cursor-pointer transition-all"
                      style={{
                        background: isActive ? '#16161c' : '#111116',
                        border: `1px solid ${isActive ? '#f59e0b' : '#1e1e24'}`,
                      }}>

                      {/* Course header */}
                      <div className="flex items-start gap-4 mb-4">
                        <span className="text-3xl">{course.image}</span>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-display font-semibold text-sm leading-tight"
                            style={{ color: '#f4f4f5' }}>{course.title}</h2>
                          <p className="font-mono text-[10px] mt-0.5" style={{ color: '#52525b' }}>
                            {course.instructor}
                          </p>
                        </div>
                        {isEnrolled && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded flex-shrink-0"
                            style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
                            ENROLLED
                          </span>
                        )}
                      </div>

                      {/* Meta row */}
                      <div className="flex flex-wrap items-center gap-4 mb-4">
                        {[
                          ['⏱', course.duration],
                          ['📚', `${totalLessons} lessons`],
                          ['🎯', course.level],
                        ].map(([icon, val]) => (
                          <span key={val} className="font-mono text-[10px] flex items-center gap-1" style={{ color: '#52525b' }}>
                            <span>{icon}</span> {val}
                          </span>
                        ))}
                      </div>

                      {/* Progress bar (if enrolled) */}
                      {isEnrolled && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="font-mono text-[10px]" style={{ color: '#f59e0b' }}>Progress</span>
                            <span className="font-mono text-[10px]" style={{ color: '#f59e0b' }}>{progress}%</span>
                          </div>
                          <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#1e1e24' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: '#f59e0b' }} />
                          </div>
                        </div>
                      )}

                      {/* CTA — single unified button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (!isEnrolled) {
                            handleEnroll(course.id);
                          } else {
                            setActiveCourse(activeCourse === course.id ? null : course.id);
                            setActiveLesson(null);
                          }
                        }}
                        className="w-full py-2.5 rounded-lg font-mono text-xs transition-all"
                        style={{
                          background: isEnrolled
                            ? isActive
                              ? 'rgba(245,158,11,0.15)'
                              : 'rgba(245,158,11,0.08)'
                            : 'rgba(6,182,212,0.08)',
                          color: isEnrolled ? '#f59e0b' : '#06b6d4',
                          border: isEnrolled
                            ? isActive
                              ? '1px solid rgba(245,158,11,0.4)'
                              : '1px solid rgba(245,158,11,0.2)'
                            : '1px solid rgba(6,182,212,0.25)',
                        }}>
                        {!isEnrolled
                          ? 'Enroll Free'
                          : isActive
                            ? 'Close course'
                            : 'Open course'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT PANEL — Lesson Content (only visible when enrolled + course selected on desktop) */}
        {activeCourse && (() => {
          const course = COURSES.find(c => c.id === activeCourse);
          if (!course) return null;
          const courseProgress = lessonProgress[String(activeCourse)] || {};

          if (activeLesson) {
            const lessonModule = course.modules.find(m => m.lessons.some(l => l.key === activeLesson.key));
            return (
              <div className="flex-1 overflow-y-auto w-full" style={{ maxHeight: '100vh' }}>
                {/* Lesson header */}
                <div className="px-8 py-8 sticky top-0 z-10"
                  style={{ background: '#09090b', borderBottom: '1px solid #1e1e24' }}>
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="flex items-center gap-2 font-mono text-xs mb-5 transition-colors"
                    style={{ color: '#52525b' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Back to modules
                  </button>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] mb-2" style={{ color: '#f59e0b' }}>{lessonModule?.title}</p>
                      <h2 className="font-display font-bold text-xl" style={{ color: '#f4f4f5' }}>{activeLesson.title}</h2>
                    </div>
                    <button
                      onClick={() => handleToggleLesson(activeCourse, activeLesson.key)}
                      className="flex-shrink-0 flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-lg transition-all"
                      style={{
                        background: courseProgress[activeLesson.key] ? 'rgba(34,197,94,0.1)' : 'rgba(245,158,11,0.08)',
                        color: courseProgress[activeLesson.key] ? '#22c55e' : '#f59e0b',
                        border: courseProgress[activeLesson.key] ? '1px solid rgba(34,197,94,0.2)' : '1px solid rgba(245,158,11,0.2)',
                      }}>
                      <span>{courseProgress[activeLesson.key] ? '✓ Completed' : 'Mark complete'}</span>
                    </button>
                  </div>
                </div>

                {/* Lesson content */}
                <div className="px-8 py-8 max-w-3xl">
                  <div className="prose-content font-mono text-sm leading-relaxed"
                    style={{ color: '#a1a1aa', whiteSpace: 'pre-wrap' }}>
                    {activeLesson.content.split('\n\n').map((para: string, i: number) => {
                      // Format headings
                      if (para.match(/^\*\*[^*]+\*\*$/)) {
                        return <h3 key={i} className="font-display font-semibold text-base mt-6 mb-3"
                          style={{ color: '#f4f4f5' }}>{para.replace(/\*\*/g, '')}</h3>;
                      }
                      // Format code blocks
                      if (para.startsWith('```')) {
                        const code = para.replace(/```[a-z]*\n?/g, '');
                        return <pre key={i} className="rounded-lg p-4 my-4 text-xs overflow-x-auto"
                          style={{ background: '#111116', border: '1px solid #1e1e24', color: '#a1a1aa' }}>{code}</pre>;
                      }
                      // Format inline code
                      const formatted = para.replace(/`([^`]+)`/g, '<code style="background:#1e1e24;padding:1px 5px;border-radius:3px;color:#f59e0b;font-size:0.85em">$1</code>');
                      return <p key={i} className="mb-4 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatted }} />;
                    })}
                  </div>

                  {/* Next/Prev lesson navigation */}
                  <div className="mt-10 pt-6 flex items-center justify-between"
                    style={{ borderTop: '1px solid #1e1e24' }}>
                    {(() => {
                      const allLessons = course.modules.flatMap(m => m.lessons);
                      const idx = allLessons.findIndex(l => l.key === activeLesson.key);
                      const prev = idx > 0 ? allLessons[idx - 1] : null;
                      const next = idx < allLessons.length - 1 ? allLessons[idx + 1] : null;
                      return (
                        <>
                          {prev ? (
                            <button
                              onClick={() => setActiveLesson(prev)}
                              className="flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-lg transition-all"
                              style={{ color: '#52525b', background: '#111116', border: '1px solid #1e1e24' }}>
                              ← {prev.title}
                            </button>
                          ) : <div />}
                          {next ? (
                            <button
                              onClick={() => setActiveLesson(next)}
                              className="flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-lg transition-all"
                              style={{ color: '#06b6d4', background: 'rgba(6,182,212,0.08)', border: '1px solid rgba(6,182,212,0.2)' }}>
                              {next.title} →
                            </button>
                          ) : <div />}
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          }

          // Course outline view (list of modules + lessons)
          return (
            <div className="flex-1 overflow-y-auto w-full" style={{ maxHeight: '100vh' }}>
              <div className="px-8 py-8 sticky top-0 z-10"
                style={{ background: '#09090b', borderBottom: '1px solid #1e1e24' }}>
                <button
                  onClick={() => setActiveCourse(null)}
                  className="flex items-center gap-2 font-mono text-xs mb-5 transition-colors"
                  style={{ color: '#52525b' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#f59e0b')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#52525b')}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  All courses
                </button>
                <h2 className="font-display font-bold text-xl" style={{ color: '#f4f4f5' }}>{course.title}</h2>
                <p className="font-mono text-xs mt-1" style={{ color: '#52525b' }}>
                  {course.modules.length} modules · {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                </p>
              </div>

              <div className="px-8 py-6 space-y-6 max-w-2xl">
                {course.modules.map((mod, mi) => (
                  <div key={mi} className="rounded-xl overflow-hidden"
                    style={{ background: '#111116', border: '1px solid #1e1e24' }}>
                    <div className="px-6 py-4" style={{ borderBottom: '1px solid #1e1e24', background: '#16161c' }}>
                      <p className="font-mono text-xs font-semibold" style={{ color: '#f59e0b' }}>{mod.title}</p>
                      <p className="font-mono text-[10px] mt-0.5" style={{ color: '#52525b' }}>
                        {mod.lessons.length} lessons
                      </p>
                    </div>
                    <div className="divide-y" style={{ borderColor: '#1e1e24' }}>
                      {mod.lessons.map((lesson, li) => {
                        const done = !!courseProgress[lesson.key];
                        return (
                          <button
                            key={li}
                            onClick={() => setActiveLesson(lesson)}
                            className="w-full flex items-center gap-4 px-6 py-4 text-left transition-all"
                            style={{ background: 'transparent' }}
                            onMouseEnter={e => (e.currentTarget.style.background = '#16161c')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                background: done ? '#22c55e' : 'transparent',
                                border: done ? '#22c55e' : '#3f3f46',
                              }}>
                              {done && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5L4 7L8 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-mono text-xs"
                                style={{ color: done ? '#52525b' : '#a1a1aa', textDecoration: done ? 'line-through' : 'none' }}>
                                {lesson.title}
                              </p>
                            </div>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                              style={{ color: '#3f3f46', flexShrink: 0 }}>
                              <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            </svg>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })()}

        {/* Empty state — no course selected — hidden on mobile */}
        {!activeCourse && (
          <div className="hidden md:flex flex-1 items-center justify-center p-8"
            style={{ background: '#09090b' }}>
            <div className="text-center">
              <span className="text-5xl mb-4 block">📚</span>
              <p className="font-display font-semibold text-lg mb-2" style={{ color: '#f4f4f5' }}>
                Pick a course to start
              </p>
              <p className="font-mono text-xs" style={{ color: '#52525b' }}>
                Click on any enrolled course to view and read lessons
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="px-6 py-8" style={{ borderTop: '1px solid #1e1e24' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <svg width="20" height="20" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#06b6d4" strokeWidth="1.5" fill="rgba(6,182,212,0.1)"/>
              <path d="M9 14L12 17L19 10" stroke="#06b6d4" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <span className="font-display font-bold text-xs" style={{ color: '#f4f4f5' }}>
              Sec<span style={{ color: '#06b6d4' }}>Lab</span><span style={{ color: '#f59e0b' }}>NG</span>
            </span>
          </div>
          <p className="font-mono text-[10px]" style={{ color: '#3f3f46' }}>© 2026 SecLab Nigeria</p>
        </div>
      </footer>
    </div>
  );
}