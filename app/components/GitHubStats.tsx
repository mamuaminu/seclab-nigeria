'use client';

import { useState, useEffect } from 'react';

type GitHubData = {
  repos: number;
  stars: number;
  followers: number;
  gists: number;
};

export function GitHubStats() {
  const [data, setData] = useState<GitHubData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api.github.com/users/mamuaminu', {
      headers: { Accept: 'application/vnd.github.v3+json' },
    })
      .then(r => r.json())
      .then(d => {
        setData({
          repos: d.public_repos ?? 0,
          stars: d.public_gists ?? 0,
          followers: d.followers ?? 0,
          gists: d.public_gists ?? 0,
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <span className="font-mono text-[#555] text-xs">loading...</span>;
  }

  if (!data) {
    return <span className="font-mono text-[#555] text-xs">unavailable</span>;
  }

  return (
    <div className="flex items-center gap-4 text-xs">
      {[
        { label: 'Repos', value: data.repos },
        { label: 'Followers', value: data.followers },
        { label: 'Gists', value: data.gists },
      ].map(({ label, value }) => (
        <div key={label} className="flex items-center gap-1.5">
          <span className="font-mono text-[#555] text-[10px]">{label}:</span>
          <span className="font-mono text-[#00FF41] text-xs font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}
