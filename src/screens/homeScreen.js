export function renderHomeScreen() {
  return {
    html: `
      <article class="screen-card">
        <p class="eyebrow">Pantalla</p>
        <h2>Inicio</h2>
        <p>Este sistema permite gestionar las faenas comunitarias de manera eficiente.
        Si eres Administrador, puedes acceder desde <a href="#/login">aquí</a>.</p>
        Si eres Usuario, puedes acceder desde <a href="#/user">aquí</a>.
        <p>Puedes consultar las actividades programadas, y el listado de las actividades realizadas. Ademas de visualizar un resumen general de las faenas comunitarias.</p>
       
      </article>
    `,
  };
}
