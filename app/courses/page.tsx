'use client';

import { useState, useEffect, useCallback } from 'react';
import { getEnrolledCourses, enrollCourse, unenrollCourse, getCourseProgress, setLessonComplete } from '@/app/lib/supabase';
import { addXP } from '@/app/components/StreakCounter';
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

function getUsername() {
  if (typeof window === 'undefined') return 'Anonymous';
  return localStorage.getItem('seclab_username') || 'Anonymous';
}

function certificateHTML(courseTitle: string, completedAt: string): string {
  const userName = getUsername();
  return `
<!DOCTYPE html>
<html>
<head>
<title>SecLab Nigeria — Certificate of Completion</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; background: var(--bg); color: #e8e8f0; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 40px; }
  .cert { width: 800px; max-width: 100%; background: #13131c; border: 2px solid var(--brand-border); border-radius: 16px; padding: 60px; text-align: center; position: relative; overflow: hidden; }
  .cert::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse at 50% 0%, rgba(0,201,167,0.08) 0%, transparent 70%); pointer-events: none; }
  .logo { font-size: 24px; font-weight: 700; margin-bottom: 40px; }
  .cert .accent { color: #00c9a7; }
  .cert .amber { color: #f0a500; }
  .title { font-size: 12px; letter-spacing: 4px; color: #52525b; text-transform: uppercase; margin-bottom: 20px; }
  .course { font-size: 28px; font-weight: 700; color: #e8e8f0; margin-bottom: 30px; line-height: 1.3; }
  .user { font-size: 20px; color: #00c9a7; margin-bottom: 30px; }
  .meta { font-size: 13px; color: #52525b; margin-bottom: 50px; }
  .footer { font-size: 11px; color: #38384a; border-top: 1px solid rgba(255,255,255,0.06); padding-top: 20px; }
  .badge { display: inline-block; background: rgba(245,158,11,0.12); color: #f0a500; border: 1px solid rgba(245,158,11,0.25); padding: 4px 12px; border-radius: 20px; font-size: 11px; margin-bottom: 20px; }
  @media print { body { background: #0b0b10; } .cert { border: 2px solid #00c9a7; } }
</style>
</head>
<body>
<div class="cert">
  <div class="logo"><span class="accent">Sec</span><span class="accent">Lab</span><span class="amber">NG</span></div>
  <div class="badge">🏆 Certificate of Completion</div>
  <div class="title">This certifies that</div>
  <div class="user">${userName}</div>
  <div class="title">has successfully completed</div>
  <div class="course">${courseTitle}</div>
  <div class="meta">Completed on ${completedAt} · Powered by SecLab Nigeria</div>
  <div class="footer">SecLab Nigeria · seclab.ng · This certificate is verifiable at seclab.ng/courses</div>
</div>
</body>
</html>`;
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
  const [confetti, setConfetti] = useState(false);
  const [certData, setCertData] = useState<{ courseTitle: string; completedAt: string } | null>(null);
  const [toast, setToast] = useState<{ visible: boolean; message: string; courseTitle: string }>({
    visible: false,
    message: '',
    courseTitle: '',
  });

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
    const course = COURSES.find(c => c.id === courseId);
    try {
      await enrollCourse(userId, courseId);
      setEnrolled(prev => [...prev, courseId]);
      setLessonProgress(prev => ({ ...prev, [String(courseId)]: {} }));
      setToast({
        visible: true,
        message: 'Enrolled! +10 XP',
        courseTitle: course?.title || '',
      });
      addXP(10);
      setTimeout(() => setToast(prev => ({ ...prev, visible: false })), 4000);
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
      setLessonProgress(prev => {
        const updated = {
          ...prev,
          [String(courseId)]: {
            ...(prev[String(courseId)] || {}),
            [lessonKey]: next,
          },
        };
        const course = COURSES.find(c => c.id === courseId);
        if (course && next) {
          addXP(5);
          const allLessons = course.modules.flatMap(m => m.lessons);
          const completedCount = allLessons.filter(l => updated[String(courseId)]?.[l.key]).length;
          if (completedCount === allLessons.length) {
            setCertData({ courseTitle: course?.title || '', completedAt: new Date().toLocaleDateString() });
            setConfetti(true);
            setTimeout(() => setConfetti(false), 3000);
            const courseTitle = course?.title || '';
            setToast({
              visible: true,
              message: '🎉 Course Complete!',
              courseTitle,
            });
            setTimeout(() => { setToast(prev => ({ ...prev, visible: false })); setCertData(null); }, 6000);
          }
        }
        return updated;
      });
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
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>

      {/* NAV */}
      <nav className="fixed top-0 left-0 right-0 z-50 h-16 flex items-center px-6"
        style={{ background: 'rgba(19,19,28,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid var(--border)', boxShadow: '0 4px 24px rgba(0,0,0,0.3)' }}>
        <div className="max-w-6xl mx-auto w-full flex items-center justify-between">
          <a href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand-border)' }}>
              <svg width="18" height="18" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#00c9a7" strokeWidth="1.5" fill="rgba(0,201,167,0.1)"/>
                <path d="M9 14L12 17L19 10" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-sm" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: 'var(--brand)' }}>Lab</span><span style={{ color: 'var(--amber)' }}>NG</span>
            </span>
          </a>
          <div className="flex items-center gap-1">
            {([
              { label: 'CTF', href: '/ctf', active: false },
              { label: 'Courses', href: '/courses', active: true },
              { label: 'Recon', href: '/recon', active: false },
            ]).map(({ label, href, active }) => (
              <a key={label} href={href}
                className="font-mono text-xs px-4 py-2 rounded-lg transition-all"
                style={{
                  color: active ? 'var(--amber)' : 'var(--text-2)',
                  background: active ? 'var(--amber-dim)' : 'transparent',
                  textDecoration: 'none',
                }}>
                {label}
              </a>
            ))}
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="pt-20 md:pt-32 pb-10 px-6 relative overflow-hidden">
        {/* Ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,201,167,0.06) 0%, transparent 70%)',
          }} />
        <div className="max-w-6xl mx-auto relative">
          <span className="section-label">// FREE SECURITY TRAINING</span>
          <h1 className="font-display font-bold text-4xl mt-3 mb-3" style={{ color: 'var(--text)' }}>
            Learn by <span style={{ color: 'var(--amber)' }}>breaking</span> things
          </h1>
          <p className="font-mono text-sm" style={{ color: 'var(--text-2)' }}>
            7 courses · Real content · Progress syncs across devices
          </p>
          {/* Gradient line */}
          <div className="mt-6 h-px w-full" style={{
            background: 'linear-gradient(90deg, var(--brand) 0%, var(--amber) 50%, transparent 100%)',
            opacity: 0.4,
          }} />
        </div>
      </section>

      {/* TWO-COLUMN LAYOUT */}
      <div className="pt-4 pb-0 min-h-screen flex flex-col md:flex-row">

        {/* LEFT — Course List */}
        <div className={activeCourse ? 'hidden md:block flex-1 overflow-y-auto' : 'flex-1 overflow-y-auto'}
          style={{
            width: '100%',
            flexShrink: 0,
            borderRight: activeCourse ? '1px solid var(--border)' : 'none',
            maxHeight: activeCourse ? 'calc(100vh - 64px)' : 'unset',
            position: activeCourse ? 'sticky' : 'static',
            top: activeCourse ? '64px' : 'unset',
          }}>
          {/* COURSE CARDS */}
          <section className="px-6 py-6">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="flex items-center gap-3 font-mono text-sm" style={{ color: 'var(--text-3)' }}>
                  <svg className="animate-spin" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M8 1V4M8 12V15M1 8H4M12 8H15M3.05 3.05L5.28 5.28M10.72 10.72L12.95 12.95M3.05 12.95L5.28 10.72M10.72 5.28L12.95 3.05"
                      stroke="var(--brand)" strokeWidth="1.5" strokeLinecap="round"/>
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
                  const circumference = 2 * Math.PI * 20;
                  const offset = circumference * (1 - progress / 100);
                  const isComplete = progress === 100;

                  return (
                    <div key={course.id}
                      className="card rounded-2xl p-5 cursor-pointer group"
                      style={{
                        background: isActive ? 'var(--surface-2)' : 'var(--surface)',
                        border: `1px solid ${isActive ? 'var(--amber-border)' : 'var(--border)'}`,
                      }}>

                      {/* Progress ring — top right */}
                      {isEnrolled && (
                        <div className="absolute top-4 right-4">
                          <svg width="48" height="48" viewBox="0 0 48 48">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="var(--border)" strokeWidth="4"/>
                            <circle cx="24" cy="24" r="20" fill="none"
                              stroke={isComplete ? 'var(--green)' : 'var(--amber)'}
                              strokeWidth="4"
                              strokeLinecap="round"
                              strokeDasharray={circumference}
                              strokeDashoffset={offset}
                              transform="rotate(-90 24 24)"
                              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
                            />
                            {isComplete ? (
                              <g transform="translate(24 24)">
                                <circle cx="0" cy="0" r="9" fill="rgba(16,185,129,0.15)"/>
                                <path d="M-4 0L-1 3L5 -3" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                              </g>
                            ) : (
                              <text x="24" y="24" textAnchor="middle" dominantBaseline="central"
                                fontFamily="monospace" fontSize="10" fontWeight="bold" fill="var(--text)">
                                {progress}%
                              </text>
                            )}
                          </svg>
                        </div>
                      )}

                      {/* Course header */}
                      <div className="flex items-start gap-4 mb-4 pr-14">
                        <span className="text-3xl">{course.image}</span>
                        <div className="flex-1 min-w-0">
                          <h2 className="font-display font-semibold text-sm leading-tight"
                            style={{ color: 'var(--text)' }}>{course.title}</h2>
                          <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
                            {course.instructor}
                          </p>
                        </div>
                        {isEnrolled && (
                          <span className="font-mono text-[10px] px-2 py-0.5 rounded flex-shrink-0"
                            style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid var(--amber-border)' }}>
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
                          <span key={val} className="font-mono text-[10px] flex items-center gap-1" style={{ color: 'var(--text-3)' }}>
                            <span>{icon}</span> {val}
                          </span>
                        ))}
                      </div>

                      {/* CTA button */}
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
                        className="w-full py-2.5 rounded-xl font-mono text-xs transition-all"
                        style={{
                          background: isEnrolled
                            ? isActive
                              ? 'var(--amber-dim)'
                              : 'rgba(240,165,0,0.06)'
                            : 'var(--brand-dim)',
                          color: isEnrolled ? 'var(--amber)' : 'var(--brand)',
                          border: isEnrolled
                            ? isActive
                              ? '1px solid var(--amber-border)'
                              : '1px solid rgba(240,165,0,0.15)'
                            : '1px solid var(--brand-border)',
                        }}>
                        {!isEnrolled
                          ? '+ Enroll Free'
                          : isActive
                            ? '✕ Close course'
                            : '→ Open course'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        {/* RIGHT — Lesson Content (desktop only when course active) */}
        {activeCourse && (() => {
          const course = COURSES.find(c => c.id === activeCourse);
          if (!course) return null;
          const courseProgress = lessonProgress[String(activeCourse)] || {};

          if (activeLesson) {
            const lessonModule = course.modules.find(m => m.lessons.some(l => l.key === activeLesson.key));
            return (
              <div className="flex-1 overflow-y-auto w-full" style={{ maxHeight: 'calc(100vh - 64px)' }}>
                {/* Lesson header */}
                <div className="px-8 py-8 sticky top-0 z-10"
                  style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                  <button
                    onClick={() => setActiveLesson(null)}
                    className="flex items-center gap-2 font-mono text-xs mb-5 transition-colors"
                    style={{ color: 'var(--text-2)' }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    Back to modules
                  </button>

                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[10px] mb-2" style={{ color: 'var(--amber)' }}>{lessonModule?.title}</p>
                      <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text)' }}>{activeLesson.title}</h2>
                    </div>
                    <button
                      onClick={() => handleToggleLesson(activeCourse, activeLesson.key)}
                      className="flex-shrink-0 flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-xl transition-all"
                      style={{
                        background: courseProgress[activeLesson.key] ? 'var(--green-dim)' : 'var(--amber-dim)',
                        color: courseProgress[activeLesson.key] ? 'var(--green)' : 'var(--amber)',
                        border: courseProgress[activeLesson.key] ? '1px solid var(--green-border)' : '1px solid var(--amber-border)',
                      }}>
                      <span>{courseProgress[activeLesson.key] ? '✓ Completed' : 'Mark complete'}</span>
                    </button>
                  </div>
                </div>

                {/* Lesson content */}
                <div className="px-8 py-8 max-w-3xl">
                  <div className="prose-content font-mono text-sm leading-relaxed"
                    style={{ color: 'var(--text-2)', whiteSpace: 'pre-wrap' }}>
                    {activeLesson.content.split('\n\n').map((para: string, i: number) => {
                      if (para.match(/^\*\*[^*]+\*\*$/)) {
                        return <h3 key={i} className="font-display font-semibold text-base mt-6 mb-3"
                          style={{ color: 'var(--text)' }}>{para.replace(/\*\*/g, '')}</h3>;
                      }
                      if (para.startsWith('```')) {
                        const code = para.replace(/```[a-z]*\n?/g, '');
                        return <pre key={i} className="rounded-xl p-4 my-4 text-xs overflow-x-auto"
                          style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>{code}</pre>;
                      }
                      const formatted = para.replace(/`([^`]+)`/g, '<code style="background:var(--surface-2);padding:1px 5px;border-radius:3px;color:var(--amber);font-size:0.85em">$1</code>');
                      return <p key={i} className="mb-4 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: formatted }} />;
                    })}
                  </div>

                  {/* Prev/Next navigation */}
                  <div className="mt-10 pt-6 flex items-center justify-between"
                    style={{ borderTop: '1px solid var(--border)' }}>
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
                              className="flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-xl transition-all"
                              style={{ color: 'var(--text-2)', background: 'var(--surface)', border: '1px solid var(--border)' }}>
                              ← {prev.title}
                            </button>
                          ) : <div />}
                          {next ? (
                            <button
                              onClick={() => setActiveLesson(next)}
                              className="flex items-center gap-2 font-mono text-xs px-4 py-2 rounded-xl transition-all"
                              style={{ color: 'var(--brand)', background: 'var(--brand-dim)', border: '1px solid var(--brand-border)' }}>
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

          // Course outline
          return (
            <div className="flex-1 overflow-y-auto w-full" style={{ maxHeight: 'calc(100vh - 64px)' }}>
              <div className="px-8 py-8 sticky top-0 z-10"
                style={{ background: 'var(--bg)', borderBottom: '1px solid var(--border)' }}>
                <button
                  onClick={() => setActiveCourse(null)}
                  className="flex items-center gap-2 font-mono text-xs mb-5 transition-colors"
                  style={{ color: 'var(--text-2)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-2)')}>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  All courses
                </button>
                <h2 className="font-display font-bold text-xl" style={{ color: 'var(--text)' }}>{course.title}</h2>
                <p className="font-mono text-xs mt-1" style={{ color: 'var(--text-3)' }}>
                  {course.modules.length} modules · {course.modules.reduce((a, m) => a + m.lessons.length, 0)} lessons
                </p>
              </div>

              <div className="px-8 py-6 space-y-4 max-w-2xl">
                {course.modules.map((mod, mi) => (
                  <div key={mi} className="rounded-2xl overflow-hidden"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                    <div className="px-6 py-4" style={{ borderBottom: '1px solid var(--border)', background: 'var(--surface-2)' }}>
                      <p className="font-mono text-xs font-semibold" style={{ color: 'var(--amber)' }}>{mod.title}</p>
                      <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-3)' }}>
                        {mod.lessons.length} lessons
                      </p>
                    </div>
                    <div className="divide-y" style={{ borderColor: 'var(--border)' }}>
                      {mod.lessons.map((lesson, li) => {
                        const done = !!courseProgress[lesson.key];
                        return (
                          <button
                            key={li}
                            onClick={() => setActiveLesson(lesson)}
                            className="w-full flex items-center gap-4 px-6 py-4 text-left transition-all"
                            style={{ background: 'transparent' }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                            <div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0 transition-all"
                              style={{
                                background: done ? 'var(--green)' : 'transparent',
                                border: done ? 'var(--green)' : 'var(--text-4)',
                              }}>
                              {done && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                                  <path d="M2 5L4 7L8 3" stroke="#000" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                              )}
                            </div>
                            <p className="flex-1 font-mono text-xs"
                              style={{ color: done ? 'var(--text-3)' : 'var(--text-2)', textDecoration: done ? 'line-through' : 'none' }}>
                              {lesson.title}
                            </p>
                            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"
                              style={{ color: 'var(--text-4)', flexShrink: 0 }}>
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

        {/* Empty state — desktop only */}
        {!activeCourse && (
          <div className="hidden md:flex flex-1 items-center justify-center p-8"
            style={{ background: 'var(--bg)' }}>
            <div className="text-center">
              <span className="text-5xl mb-4 block">📚</span>
              <p className="font-display font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>
                Pick a course to start
              </p>
              <p className="font-mono text-xs" style={{ color: 'var(--text-3)' }}>
                Click on any enrolled course to read lessons
              </p>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="px-6 py-8" style={{ borderTop: '1px solid var(--border)', background: 'var(--surface)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--brand-dim)', border: '1px solid var(--brand-border)' }}>
              <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
                <path d="M14 2L25 8V20L14 26L3 20V8L14 2Z" stroke="#00c9a7" strokeWidth="1.5" fill="rgba(0,201,167,0.1)"/>
                <path d="M9 14L12 17L19 10" stroke="#00c9a7" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="font-display font-bold text-xs" style={{ color: 'var(--text)' }}>
              Sec<span style={{ color: 'var(--brand)' }}>Lab</span><span style={{ color: 'var(--amber)' }}>NG</span>
            </span>
          </div>
          <p className="font-mono text-[10px]" style={{ color: 'var(--text-4)' }}>© 2026 SecLab Nigeria</p>
        </div>
      </footer>

      {/* TOAST NOTIFICATION */}
      {toast.visible && (
        <div
          className="fixed bottom-6 right-6 z-50 cursor-pointer rounded-2xl flex items-center gap-3 px-4 py-3"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderLeft: '4px solid var(--green)',
            minWidth: '280px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            animation: 'toast-in 0.3s ease-out forwards',
          }}
          onClick={() => setToast(prev => ({ ...prev, visible: false }))}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'var(--green-dim)' }}>
            <span className="text-base">🏆</span>
          </div>
          <div>
            <p className="font-mono text-xs" style={{ color: 'var(--text)' }}>{toast.message}</p>
            <p className="font-mono text-[10px] mt-0.5" style={{ color: 'var(--text-2)' }}>{toast.courseTitle}</p>
            {certData && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const printWindow = window.open('', '_blank');
                  if (!printWindow) return;
                  printWindow.document.write(certificateHTML(certData.courseTitle, certData.completedAt));
                  printWindow.document.close();
                  printWindow.print();
                }}
                className="mt-2 font-mono text-[10px] py-1 px-3 rounded-xl transition-all"
                style={{ background: 'var(--amber-dim)', color: 'var(--amber)', border: '1px solid var(--amber-border)' }}>
                🏆 Download Certificate →
              </button>
            )}
          </div>
        </div>
      )}

      {/* CONFETTI */}
      {confetti && (
        <div className="fixed inset-0 pointer-events-none z-[9999]">
          {Array.from({ length: 50 }).map((_, i) => {
            const colors = ['var(--brand)', 'var(--amber)', 'var(--green)', 'var(--text-2)', 'var(--text)', '#f05252', '#8b5cf6'];
            const color = colors[i % colors.length];
            const left = Math.random() * 100;
            const delay = Math.random() * 0.6;
            const size = 6 + Math.random() * 8;
            return (
              <div
                key={i}
                className="confetti-piece"
                style={{
                  left: `${left}%`,
                  width: size,
                  height: size,
                  background: color,
                  animationDelay: `${delay}s`,
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}