export type AdminContentKey = 'news' | 'education-work' | 'research' | 'projects' | 'qualifications';

export type AdminProfile = {
  id: 'main'; name: string; english_name: string; role: string; email: string;
  university_name: string; department_name: string; department_url: string;
  lab_name: string; lab_url: string; profile_image_path: string; hero_image_path: string;
  social_links: { github?: string; twitter?: string };
};

export type AdminNews = { id: string; category: 'Internship' | 'Job Hunting' | 'Research'; date_label: string; title: string; description: string; link_url: string; display_order: number; is_published: boolean; updated_at: string };
export type AdminEducationWork = { id: string; type: 'Education' | 'Work'; short_work: boolean; date_label: string; title: string; subtitle: string; logo_path: string; material_url: string; tags: string[]; is_current: boolean; display_order: number; is_published: boolean; updated_at: string };
export type AdminResearch = { id: string; title: string; description: string; image_path: string; tags: string[]; link_url: string; is_current: boolean; display_order: number; is_published: boolean; updated_at: string };
export type AdminProject = { id: string; title: string; description: string; tech: string[]; image_path: string; link_url: string; display_order: number; is_published: boolean; updated_at: string };
export type AdminQualification = { id: string; name: string; label: string; date_label: string; display_order: number; is_published: boolean; updated_at: string };
export type AdminRecord = AdminNews | AdminEducationWork | AdminResearch | AdminProject | AdminQualification;
