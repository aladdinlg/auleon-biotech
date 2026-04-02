'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [pwd, setPwd] = useState('');
  const [error, setError] = useState(false);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correct = 'auleon2026';
    if (pwd === correct) {
      document.cookie = `auth-token=auleon2026; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
      router.push('/');
    } else {
      setError(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-sm rounded-2xl bg-slate-800 p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-teal-400">澳龙生物</h1>
          <p className="mt-1 text-sm text-slate-400">兽用免疫学知识图谱</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={pwd}
            onChange={e => { setPwd(e.target.value); setError(false); }}
            placeholder="访问密码 Access Password"
            className="w-full rounded-lg bg-slate-700 px-4 py-3 text-white placeholder-slate-400 outline-none focus:ring-2 focus:ring-teal-500"
          />
          {error && <p className="text-sm text-red-400">密码错误 Incorrect password</p>}
          <button
            type="submit"
            className="w-full rounded-lg bg-teal-600 py-3 font-semibold text-white hover:bg-teal-500 transition-colors"
          >
            进入 Enter
          </button>
        </form>
      </div>
    </div>
  );
}
