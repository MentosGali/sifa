export function renderUserScreen() {
  return {
    html: `
      <article class="screen-card">
        <p class="eyebrow">Login</p>
        <h2>Login Usuarios</h2>
        <form id="login-form" class="stack" >
          <label for="identificador">
            Identificacion
            <input class="input" name="identificador"  placeholder="1,2,3..." required />
          </label>
          <label for="password">
            Contrasena
            <input class="input" name="password" type="password" placeholder="********" required />
          </label>
          <button type="submit">Ingresar</button>
        </form>
        <p id="login-feedback" class="muted"></p>
      </article>
    `,
    onMount(screenRoot) {
      const form = screenRoot.querySelector("#login-form");
      const feedback = screenRoot.querySelector("#login-feedback");

      form?.addEventListener("submit", (event) => {
        event.preventDefault();
        if (!feedback) return;
        feedback.textContent = "Formulario capturado. Aqui conectas tu API.";
      });
    },
  };
}
