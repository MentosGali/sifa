import { supabase } from "../config/supabase.js";

export function renderUserScreen() {
  return {
    html: `
      <article class="screen-card">

        <!-- HEADER COLONO -->
        <div id="user-header" style="margin-bottom:20px;">
          <p class="eyebrow">Mi Perfil</p>
          <h2 id="user-nombre"></h2>
          <p id="user-cuadrilla" style="font-size:13px;color:#64748b;"></p>
        </div>

        <!-- RESUMEN -->
        <div id="user-resumen" style="display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:20px;"></div>

        <!-- FAENAS ACTIVAS -->
        <div style="margin-bottom:20px;">
          <h3 style="font-size:15px;margin-bottom:10px;">Faenas Activas</h3>
          <div id="user-faenas-activas"></div>
        </div>

        <!-- HISTORIAL -->
        <div>
          <h3 style="font-size:15px;margin-bottom:10px;">Historial de Faenas</h3>
          <div id="user-historial"></div>
        </div>

        <!-- BOTON CERRAR SESION -->
        <button id="btn-cerrar-sesion" style="margin-top:24px;width:100%;padding:12px;
          background:#1e293b;color:#94a3b8;border:1px solid #334155;border-radius:8px;cursor:pointer;">
          Cerrar Sesión
        </button>

      </article>
    `,

    async onMount(root) {
      const sesion = JSON.parse(sessionStorage.getItem("sesion"));

      if (!sesion || sesion.tipo !== "colono") {
        window.location.hash = "/login";
        return;
      }

      // HEADER
      root.querySelector("#user-nombre").textContent =
        `${sesion.nombre} ${sesion.ap_paterno} ${sesion.ap_materno}`;

      // cuadrilla
      if (sesion.cuadrilla_id) {
        const { data: cuadrilla } = await supabase
          .from("cuadrillas")
          .select("nombre")
          .eq("id", sesion.cuadrilla_id)
          .single();
        root.querySelector("#user-cuadrilla").textContent = cuadrilla
          ? `📍 ${cuadrilla.nombre}`
          : "";
      }

      // CARGAR ASISTENCIAS DEL COLONO
      const { data: asistencias } = await supabase
        .from("asistencia")
        .select("*, faenas(*)")
        .eq("colono_id", sesion.id);

      // RESUMEN
      const cumplidas =
        asistencias?.filter((a) => a.estado === "asistio").length || 0;
      const faltas =
        asistencias?.filter((a) => a.estado === "falto").length || 0;
      const justificadas =
        asistencias?.filter((a) => a.estado === "justificado").length || 0;
      const pagadas =
        asistencias?.filter((a) => a.estado === "pago").length || 0;

      // calcular deuda
      const deuda =
        asistencias?.reduce((total, a) => {
          if (a.estado !== "falto") return total;
          return total + (a.faenas?.tipo === "agua" ? 250 : 100);
        }, 0) || 0;

      root.querySelector("#user-resumen").innerHTML = `
        <div style="background:#0f172a;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:24px;font-weight:700;color:#10b981;">${cumplidas}</div>
          <div style="font-size:11px;color:#64748b;">Cumplidas</div>
        </div>
        <div style="background:#0f172a;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:24px;font-weight:700;color:#ef4444;">${faltas}</div>
          <div style="font-size:11px;color:#64748b;">Faltas</div>
        </div>
        <div style="background:#0f172a;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:24px;font-weight:700;color:#64748b;">${justificadas}</div>
          <div style="font-size:11px;color:#64748b;">Justificadas</div>
        </div>
        <div style="background:#0f172a;border-radius:10px;padding:12px;text-align:center;">
          <div style="font-size:24px;font-weight:700;color:#f59e0b;">$${deuda}</div>
          <div style="font-size:11px;color:#64748b;">Deuda total</div>
        </div>
      `;

      // FAENAS ACTIVAS
      const { data: faenasActivas } = await supabase
        .from("faenas")
        .select("*")
        .eq("estado", "activa")
        .order("fecha", { ascending: true });

      const contenedorActivas = root.querySelector("#user-faenas-activas");

      if (!faenasActivas?.length) {
        contenedorActivas.innerHTML =
          "<p style='font-size:13px;color:#64748b;'>No hay faenas activas.</p>";
      } else {
        contenedorActivas.innerHTML = faenasActivas
          .map(
            (f) => `
          <div style="background:#0f172a;border-radius:10px;padding:12px;
            margin-bottom:10px;border-left:3px solid #f59e0b;">
            <div style="font-weight:600;font-size:13px;">${f.descripcion}</div>
            <div style="font-size:11px;color:#64748b;margin-top:4px;">
              📅 ${f.fecha} · ${f.tipo} · ${f.alcance}
            </div>
          </div>
        `,
          )
          .join("");
      }

      // HISTORIAL
      const contenedorHistorial = root.querySelector("#user-historial");

      if (!asistencias?.length) {
        contenedorHistorial.innerHTML =
          "<p style='font-size:13px;color:#64748b;'>Sin historial aún.</p>";
      } else {
        contenedorHistorial.innerHTML = asistencias
          .map((a) => {
            const colores = {
              asistio: { bg: "#064e3b", color: "#10b981", label: "✅ Asistió" },
              falto: { bg: "#450a0a", color: "#ef4444", label: "❌ Faltó" },
              justificado: {
                bg: "#1c1917",
                color: "#78716c",
                label: "🤒 Justificado",
              },
              pago: { bg: "#1c1917", color: "#f59e0b", label: "💰 Pagó" },
            };
            const c = colores[a.estado] || {
              bg: "#1e293b",
              color: "#94a3b8",
              label: a.estado,
            };
            const multa =
              a.estado === "falto"
                ? `<span style="font-size:11px;color:#ef4444;">Multa: $${a.faenas?.tipo === "agua" ? 250 : 100}</span>`
                : "";

            return `
            <div style="background:#0f172a;border-radius:10px;padding:12px;
              margin-bottom:8px;border-left:3px solid ${c.color};">
              <div style="display:flex;justify-content:space-between;align-items:center;">
                <div style="font-weight:600;font-size:13px;">${a.faenas?.descripcion || "Faena"}</div>
                <span style="font-size:11px;padding:2px 8px;border-radius:20px;
                  background:${c.bg};color:${c.color};">${c.label}</span>
              </div>
              <div style="font-size:11px;color:#64748b;margin-top:4px;">
                📅 ${a.faenas?.fecha || ""} · ${a.faenas?.tipo || ""}
              </div>
              ${multa}
            </div>
          `;
          })
          .join("");
      }

      // CERRAR SESION
      root.querySelector("#btn-cerrar-sesion").addEventListener("click", () => {
        sessionStorage.removeItem("sesion");
        window.location.hash = "/login";
      });
    },
  };
}
