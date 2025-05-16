import { useAuth } from '@clerk/astro/react';
import { createClient } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';

export function useSupabase() {
  const { getToken } = useAuth();
  const [supabase, setSupabase] = useState(null);

  useEffect(() => {
    const init = async () => {
      const token = await getToken(); // 🔥 ¡SIN template!
      const client = createClient(
        import.meta.env.PUBLIC_SUPABASE_URL!,
        import.meta.env.PUBLIC_SUPABASE_ANON_KEY!,
        {
          global: {
            headers: {
              Authorization: `Bearer ${token}`, // 🔐 Usa el session token de Clerk
            },
          },
        }
      );

      setSupabase(client as any);
    };

    init();
  }, []);

  return supabase;
}
