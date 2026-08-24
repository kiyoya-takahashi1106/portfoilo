import React, { useEffect, useMemo, useState } from 'react';
import { addAdmin, getAdmins, removeAdmin } from '../../services/adminService';
import { AdminUser } from '../../types/admin';

const buttonClass = 'inline-flex h-11 items-center justify-center border px-4 text-sm font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const formatDate = (value: string) => {
  if (!value) return '-';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('ja-JP', { dateStyle: 'medium', timeStyle: 'short' }).format(date);
};

export const AdminsPage = ({ currentEmail, onBack }: { currentEmail: string; onBack: () => void }) => {
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [nextEmail, setNextEmail] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState('');
  const [error, setError] = useState('');
  const [target, setTarget] = useState<AdminUser | null>(null);

  const normalizedEmail = useMemo(() => nextEmail.trim().toLowerCase(), [nextEmail]);
  const current = currentEmail.trim().toLowerCase();

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      setAdmins(await getAdmins());
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '管理者一覧を取得できませんでした。');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const submit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (!emailPattern.test(normalizedEmail)) return setError('有効なメールアドレスを入力してください。');
    if (admins.some((admin) => admin.email.toLowerCase() === normalizedEmail)) return setError('このメールアドレスはすでに管理者です。');
    setSaving(true);
    try {
      await addAdmin(normalizedEmail);
      setNextEmail('');
      await load();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '管理者を追加できませんでした。');
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!target) return;
    setDeleting(target.email);
    setError('');
    try {
      await removeAdmin(target.email);
      setAdmins((items) => items.filter((admin) => admin.email !== target.email));
      setTarget(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '管理者を削除できませんでした。');
    } finally {
      setDeleting('');
    }
  };

  return <main className="mx-auto max-w-[1040px] px-5 py-8 sm:px-8">
    <button type="button" onClick={onBack} className="text-sm font-semibold text-slate-500">← ダッシュボードに戻る</button>
    <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight">管理者一覧</h1>
        <p className="mt-2 text-sm text-slate-500">Googleログイン後にCMSを操作できるメールアドレスを管理します。</p>
      </div>
      <div className="border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600">{admins.length} admins</div>
    </div>

    <form onSubmit={submit} className="mt-6 grid gap-3 border border-slate-200 bg-white p-5 shadow-sm sm:grid-cols-[minmax(0,1fr)_auto]">
      <input value={nextEmail} onChange={(event) => setNextEmail(event.target.value)} type="email" className="h-11 border border-slate-200 px-3 text-sm outline-none focus:border-indigo-500" />
      <button disabled={saving || !nextEmail.trim()} className={`${buttonClass} border-indigo-600 bg-indigo-600 text-white`}>{saving ? '追加中...' : '+ 管理者を追加'}</button>
    </form>

    {error && <p className="mt-4 border border-rose-200 bg-rose-50 p-3 text-sm text-rose-600">{error}</p>}

    <section className="mt-5 border border-slate-200 bg-white shadow-sm">
      {loading ? <p className="p-8 text-center text-sm text-slate-500">読み込み中...</p> : admins.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">管理者が登録されていません。</p> : admins.map((admin) => {
        const isCurrent = admin.email.toLowerCase() === current;
        return <div key={admin.email} className="grid gap-4 border-b border-slate-200 p-5 last:border-0 sm:grid-cols-[minmax(0,1fr)_180px_auto] sm:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold">{admin.email}</p>
              {isCurrent && <span className="border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-bold text-emerald-600">現在ログイン中</span>}
            </div>
            <p className="mt-1 text-sm text-slate-500">管理者</p>
          </div>
          <p className="text-sm text-slate-500">{formatDate(admin.created_at)}</p>
          {isCurrent ? <button type="button" disabled className={`${buttonClass} h-9 border-slate-200 px-3 text-slate-400`}>削除不可</button> : <button type="button" disabled={Boolean(deleting)} onClick={() => setTarget(admin)} className={`${buttonClass} h-9 border-rose-400 px-3 text-rose-500`}>{deleting === admin.email ? '削除中...' : '削除'}</button>}
        </div>;
      })}
    </section>

    {target && <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/35 px-4">
      <div className="w-full max-w-sm bg-white p-6 shadow-xl">
        <h2 className="text-lg font-bold">管理者を削除しますか？</h2>
        <p className="mt-2 break-all text-sm text-slate-500">{target.email}</p>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={() => setTarget(null)} className={`${buttonClass} border-slate-200`}>キャンセル</button>
          <button type="button" disabled={Boolean(deleting)} onClick={remove} className={`${buttonClass} border-rose-500 bg-rose-500 text-white`}>削除</button>
        </div>
      </div>
    </div>}
  </main>;
};
