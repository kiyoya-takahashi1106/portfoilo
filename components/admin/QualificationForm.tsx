import React, { useState } from 'react';
import { AdminQualification } from '../../types/admin';
import { Field, inputClass, StatusFields } from './FormControls';

export const QualificationForm = ({ initial, onSave }: { initial?: AdminQualification; onSave: (value: Omit<AdminQualification, 'id' | 'updated_at'>) => Promise<void> }) => {
  const [value, setValue] = useState<Omit<AdminQualification, 'id' | 'updated_at'>>({ name: initial?.name ?? '', label: initial?.label ?? '', date_label: initial?.date_label ?? '', display_order: initial?.display_order ?? 0, is_published: initial?.is_published ?? true });
  const [error, setError] = useState(''); const update = <K extends keyof typeof value>(key: K, next: (typeof value)[K]) => setValue({ ...value, [key]: next });
  return <form onSubmit={(event) => { event.preventDefault(); if (!value.name || !value.label) return setError('NameとLabelを入力してください。'); onSave(value); }} className="max-w-3xl space-y-5"><Field label="Name" required><input value={value.name} onChange={(event) => update('name', event.target.value)} className={inputClass} /></Field><Field label="Label" required><input value={value.label} onChange={(event) => update('label', event.target.value)} className={inputClass} /></Field><Field label="Date"><input value={value.date_label} onChange={(event) => update('date_label', event.target.value)} placeholder="2026 / 4" className={inputClass} /></Field><StatusFields published={value.is_published} onPublished={(next) => update('is_published', next)} order={value.display_order} onOrder={(next) => update('display_order', next)} />{error && <p className="text-sm text-rose-500">{error}</p>}<button className="h-11 border border-indigo-600 bg-indigo-600 px-7 text-sm font-semibold text-white">保存</button></form>;
};
