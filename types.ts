
export interface CentumNews {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  display_date: string;
  is_urgent: boolean;
  read_more_url: string;
  created_at?: string;
}

export interface CentumBlog {
  id: number;
  title: string;
  excerpt: string;
  image_url: string;
  category: string;
  author: string;
  display_date: string;
  read_time: string;
  slug: string;
  content_html: string;
  created_at?: string;
}

export interface CentumResult {
  id: number;
  student_name: string;
  rank: string;
  exam_type: string;
  score: string;
  image_url: string;
  achievement: string;
  exam_year: number;
  created_at?: string;
}

export interface CentumAnnouncement {
  id: number;
  title: string;
  description: string;
  read_more_url: string;
  priority: number;
  created_at?: string;
}

export interface CentumSubscriber {
  id: number;
  email: string;
  created_at?: string;
}

export interface CentumBrochure {
  id: number;
  image_url: string;
  description: string;
  created_at?: string;
}

export interface CentumEnquiry {
  id: number;
  student_name: string;
  mobile_number: string;
  class_level: string;
  location: string;
  created_at?: string;
}

export interface CentumAdmission {
  id: string;
  created_at: string;
  class_category: string;
  class_medium: string;
  student_name: string;
  student_name_malayalam?: string;
  school_name: string;
  gender: 'male' | 'female';
  dob_day?: number;
  dob_month?: number;
  dob_year?: number;
  father_name: string;
  father_occupation?: string;
  mother_name: string;
  mother_occupation?: string;
  address: string;
  pin_code: string;
  mobile_whatsapp: string;
  mobile_secondary?: string;
  email?: string;
  relation_with_centum?: string;
  preferred_batch?: 'morning' | 'holiday';
  subject_grades?: Record<string, string>;
}

export type TableName = 
  | 'centum_news' 
  | 'centum_blogs' 
  | 'centum_results' 
  | 'centum_announcements' 
  | 'centum_subscribers' 
  | 'centumbrosher'
  | 'centum_enquiries'
  | 'centum_admissions';
