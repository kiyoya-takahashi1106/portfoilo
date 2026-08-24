import { Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { AdminContentKey, AdminEducationWork, AdminNews, AdminProfile, AdminProject, AdminQualification, AdminRecord, AdminResearch, AdminUser } from '../types/admin';

const client = () => {
  if (!supabase) throw new Error('Supabase environment variables are not configured.');
  return supabase;
};

const tableName = (key: AdminContentKey) => key === 'education-work' ? 'education_work' : key;

export const getAdminSession = async (): Promise<Session | null> => (await client().auth.getSession()).data.session;
export const onAdminAuthChange = (listener: () => void) => client().auth.onAuthStateChange(() => listener()).data.subscription;
export const signInWithGoogle = async () => client().auth.signInWithOAuth({ provider: 'google', options: { redirectTo: `${window.location.origin}/admin` } });
export const signOut = async () => client().auth.signOut();

export const isCurrentUserAdmin = async () => {
  const { data, error } = await client().from('admins').select('email').limit(1);
  if (error) return false;
  return data.length > 0;
};

export const getAdmins = async (): Promise<AdminUser[]> => {
  const { data, error } = await client().from('admins').select('email, created_at').order('email').returns<AdminUser[]>();
  if (error) throw error;
  return data;
};

export const addAdmin = async (email: string) => {
  const { error } = await client().from('admins').insert({ email: email.trim().toLowerCase() });
  if (error) throw error;
};

export const removeAdmin = async (email: string) => {
  const { error } = await client().from('admins').delete().eq('email', email);
  if (error) throw error;
};

export const getProfileForAdmin = async (): Promise<AdminProfile> => {
  const { data, error } = await client().from('profile').select('*').eq('id', 'main').single();
  if (error) throw error;
  return data;
};

export const saveProfile = async (profile: AdminProfile) => {
  const { error } = await client().from('profile').update(profile).eq('id', 'main');
  if (error) throw error;
};

export const getRecords = async <T extends AdminRecord>(key: AdminContentKey): Promise<T[]> => {
  const { data, error } = await client().from(tableName(key)).select('*').order('display_order').returns<T[]>();
  if (error) throw error;
  return data.map((record) => ({
    ...record,
    date_label: 'date_label' in record ? record.date_label ?? '' : undefined,
    link_url: 'link_url' in record ? record.link_url ?? '' : undefined,
    material_url: 'material_url' in record ? record.material_url ?? '' : undefined,
  })) as T[];
};

export const saveRecord = async (key: AdminContentKey, record: Partial<AdminRecord> & { id?: string }) => {
  const table = tableName(key);
  const { id, ...values } = record;
  const request = id ? client().from(table).update(values).eq('id', id) : client().from(table).insert(values);
  const { error } = await request;
  if (error) throw error;
};

export const deleteRecord = async (key: AdminContentKey, id: string) => {
  const { error } = await client().from(tableName(key)).delete().eq('id', id);
  if (error) throw error;
};

export const uploadAdminImage = async (file: File, folder: string) => {
  const extension = file.name.split('.').pop() || 'jpg';
  const path = `${folder}/${crypto.randomUUID()}.${extension}`;
  const { error } = await client().storage.from('portfolio-assets').upload(path, file, { upsert: false });
  if (error) throw error;
  return path;
};
