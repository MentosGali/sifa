import { supabase } from "../config/supabase.js";
import bcrypt from "bcryptjs";

export function renderLoginScreen() {
  return {
    html: `
      <article class="screen-card">
        <h2>Iniciar Sesión</h2>
        <form id="login-form">
          <label>Usuario o Teléfono
            <input class="input" id="username" placeholder="Usuario o teléfono" required />
          </label>
          <label>Contraseña
            <input class="input" id="password" type="password" placeholder="Contraseña" required />
          </label>
          <p id="login-error" style="color:red;display:none;">Usuario o contraseña incorrectos.</p>
          <button type="submit">Entrar</button>
        </form>
      </article>
    `,

    onMount(root) {
      const form = root.querySelector("#login-form");

      form.addEventListener("submit", async (e) => {
        e.preventDefault();
        root.querySelector("#login-error").style.display = "none";

        const username = root.querySelector("#username").value.trim();
        const password = root.querySelector("#password").value;

        // busca en usuarios
        const { data: usuarios } = await supabase
          .from("usuarios")
          .select("*")
          .eq("username", username);

        const usuario = usuarios?.[0];

        if (usuario) {
          const coincide = await bcrypt.compare(password, usuario.password);
          if (!coincide) {
            root.querySelector("#login-error").style.display = "block";
            return;
          }
          sessionStorage.setItem(
            "sesion",
            JSON.stringify({ ...usuario, tipo: "admin" }),
          );
          window.location.hash = "/admin";
          return;
        }

        // busca en colonos por teléfono
        const { data: colonos } = await supabase
          .from("colonos")
          .select("*")
          .or(`telefono.eq.${username},username.eq.${username}`);

        const colono = colonos?.[0];

        if (!colono || !colono.password) {
          root.querySelector("#login-error").style.display = "block";
          return;
        }

        const coincide = await bcrypt.compare(password, colono.password);
        if (!coincide) {
          root.querySelector("#login-error").style.display = "block";
          return;
        }

        sessionStorage.setItem(
          "sesion",
          JSON.stringify({ ...colono, tipo: "colono" }),
        );
        window.location.hash = "/user";
      });
    },
  };
}
