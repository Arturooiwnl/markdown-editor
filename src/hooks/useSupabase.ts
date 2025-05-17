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
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRjY3N1dXl6cXR3ZXhyY2VuamR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0MTYxOTUsImV4cCI6MjA2MDk5MjE5NX0.GsmLt8PMdCjMiosoRBC8co_QWMiHdCDYEzmCAYNuR_s",
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