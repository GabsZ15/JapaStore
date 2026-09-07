import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface AdminAuthValidation {
  isValid: boolean;
  statusCode?: number;
  errorMessage?: string;
  supabaseAdmin?: SupabaseClient;
}

export function validateAdminRequest(req: any): AdminAuthValidation {
  const supabaseUrlRaw = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || '';
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  const adminSecretKey = process.env.ADMIN_SECRET_KEY || '';

  // Auto-correcting known typo in URL if needed
  let supabaseUrl = supabaseUrlRaw;
  if (supabaseUrl === 'https://kqxluuxtnicsvwzmqjtk.supabase.co') {
    supabaseUrl = 'https://kqxluxtynicsvwzmqjtk.supabase.co';
  }

  // 1. Check if server environment variables are properly configured
  if (!supabaseUrl || !serviceRoleKey || !adminSecretKey) {
    return {
      isValid: false,
      statusCode: 500,
      errorMessage: 'Configuração de ambiente do servidor incompleta (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY ou ADMIN_SECRET_KEY ausente).'
    };
  }

  // 2. Validate X-Admin-Secret header
  const clientSecret = req.headers['x-admin-secret'] || req.headers['X-Admin-Secret'];

  if (!clientSecret || clientSecret !== adminSecretKey) {
    return {
      isValid: false,
      statusCode: 401,
      errorMessage: 'Não autorizado. Segredo administrativo ausente ou incorreto.'
    };
  }

  // 3. Initialize Supabase Admin Client using service_role key (server-side only)
  const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false
    }
  });

  return {
    isValid: true,
    supabaseAdmin
  };
}
