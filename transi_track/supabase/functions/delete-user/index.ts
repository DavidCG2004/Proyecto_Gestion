// supabase/functions/delete-user/index.ts (Contenido Correcto y Limpio)

// Importa los tipos para el entorno de ejecución de Supabase
import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { corsHeaders } from '../_shared/cors.ts';

console.log("Función delete-user cargada.");

Deno.serve(async (req) => {
  // Manejo de la solicitud pre-vuelo (CORS) para que el navegador permita la llamada
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // 1. Crea un cliente de Supabase usando el token de autorización del usuario que llama a la función
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    // 2. Obtiene los datos del usuario a partir de su token JWT para saber a quién borrar
    const { data: { user } } = await supabaseClient.auth.getUser();

    if (!user) {
      return new Response(JSON.stringify({ error: 'Usuario no autenticado.' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    // 3. Crea un cliente "Admin" que tiene permisos para borrar usuarios.
    //    Esto usa la SERVICE_ROLE_KEY, que es secreta y solo accesible desde el servidor.
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SERVICE_ROLE_KEY') ?? '' // <-- El nuevo nombre que sí funciona
);
    
    // 4. Ejecuta la eliminación del usuario
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user.id);
    
    if (deleteError) {
      throw deleteError;
    }

    // 5. Cierra la sesión en el navegador del cliente para una experiencia limpia
    await supabaseClient.auth.signOut();

    return new Response(JSON.stringify({ message: 'Usuario eliminado correctamente.' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500, // Usar 500 para errores inesperados del servidor
    });
  }
});