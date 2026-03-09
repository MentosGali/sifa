import { createRouter } from "./router.js";
import { renderUserScreen } from "../screens/UserScreen.js";
import { renderHomeScreen } from "../screens/homeScreen.js";
import { renderLoginScreen } from "../screens/loginScreen.js";
import { renderAdminCrud } from "../screens/adminCrud.js";
import { supabase } from "../config/supabase.js";
const { data, error } = await supabase.from("colonos").select("*");
console.log("conexion:", data, error);

// DESPUÉS
function estaAutenticado() {
  return sessionStorage.getItem("sesion") !== null;
}

export function mountApp(rootElement) {
  if (!rootElement) return;

  rootElement.innerHTML = `
    <main class="app-shell">
      <header class="hero">
        <p class="eyebrow">SIFA</p>
        <h1>Sistema De Faenas Comunitarias</h1>
   
      </header>

      <nav class="top-nav" aria-label="Navegacion principal">
        <a href="#/" class="nav-link">Inicio</a>
        <a href="#/login" class="nav-link">Iniciar Sesión</a>
        <a href="#/admin" class="nav-link">Panel Admin</a>
      </nav>

      
      <section id="screen-root" class="panel" aria-live="polite"></section>
      
    </main>
  `;

  const screenRoot = rootElement.querySelector("#screen-root");
  if (!screenRoot) return;

  const router = createRouter({
    routes: {
      "/": renderHomeScreen,
      "/login": renderLoginScreen,
      "/user": renderUserScreen,
      "/admin": () => {
        if (!estaAutenticado()) {
          window.location.hash = "/login";
          return { html: "" };
        }
        return renderAdminCrud();
      },
    },
    screenRoot,
    notFound: () => ({
      html: `
        <article class="screen-card">
          <h2>404</h2>
          <p class="muted">Pantalla no encontrada.</p>
          <a href="#/" class="nav-link">Volver al inicio</a>
        </article>
      `,
    }),
  });

  router.start();
}
