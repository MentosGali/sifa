import { adminCrud } from "../screens/adminCrud.js";

export function renderAdminList() {
  return {
    html: `
      <article class="lista-asistencias">
        <p class="eyebrow">Lista de Asistencias</p>
        <h2>Asistencias Registradas</h2>
        <table class="asistencias-table">
         
        </table>
      </article>
    `,
  };
}

const screenRoot = rootElement.querySelector("#lista-asistencias");

const router = createRouter({
  routes: {
    "/": renderHomeScreen,
    "/login": renderLoginScreen,
    "/user": renderUserScreen,
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
