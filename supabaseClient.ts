
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xhmisvxohwofpzxkizpi.supabase.co';
const SUPABASE_KEY = 'sb_publishable_n7cCpkRy1wBo95YQHwQykw_gxA98bNd';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
