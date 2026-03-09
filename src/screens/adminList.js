import { supabase } from "../config/supabase.js";

export function renderAdminAsistencia() {
  return {
    html: `
      <article class="crud-admin">
        <p class="eyebrow">Administrador</p>
        <h2>Asistencia</h2>

        <!-- LISTA DE FAENAS -->
        <div id="vista-faenas">
          <h3>Selecciona una Faena</h3>
          <div id="lista-faenas-asistencia"></div>
        </div>

        <!-- LISTA DE ASISTENCIA -->
        <div id="vista-asistencia" style="display:none;">
          <button id="btn-volver" style="margin-bottom:12px;">← Volver</button>
          <div id="info-faena"></div>
          <div id="lista-colonos-asistencia"></div>
          <button id="btn-guardar-asistencia">Guardar Asistencia</button>
        </div>

      </article>
    `,

    async onMount(root) {
      // ---- CARGAR FAENAS ----
      const { data: faenas, error } = await supabase
        .from("faenas")
        .select("*")
        .order("fecha", { ascending: false });

      const listaFaenas = root.querySelector("#lista-faenas-asistencia");

      if (error || !faenas?.length) {
        listaFaenas.innerHTML = "<p>No hay faenas registradas.</p>";
        return;
      }

      listaFaenas.innerHTML = faenas
        .map(
          (f) => `
        <div style="padding:12px;border-bottom:1px solid #334155;cursor:pointer;" data-id="${f.id}">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <strong>${f.descripcion}</strong>
            <span style="font-size:11px;padding:2px 8px;border-radius:20px;
              background:${f.estado === "activa" ? "#064e3b" : "#1e293b"};
              color:${f.estado === "activa" ? "#10b981" : "#94a3b8"}">
              ${f.estado}
            </span>
          </div>
          <div style="font-size:12px;color:#64748b;margin-top:4px;">
            📅 ${f.fecha} · ${f.tipo} · ${f.alcance}
          </div>
        </div>
      `,
        )
        .join("");

      // ---- SELECCIONAR FAENA ----
      listaFaenas.querySelectorAll("[data-id]").forEach((el) => {
        el.addEventListener("click", async () => {
          const faena = faenas.find((f) => f.id === parseInt(el.dataset.id));
          await mostrarAsistencia(faena);
        });
      });

      // ---- VOLVER ----
      root.querySelector("#btn-volver").addEventListener("click", () => {
        root.querySelector("#vista-faenas").style.display = "block";
        root.querySelector("#vista-asistencia").style.display = "none";
      });

      // ---- MOSTRAR ASISTENCIA ----
      async function mostrarAsistencia(faena) {
        root.querySelector("#vista-faenas").style.display = "none";
        root.querySelector("#vista-asistencia").style.display = "block";

        root.querySelector("#info-faena").innerHTML = `
          <div style="background:#0f172a;padding:12px;border-radius:8px;margin-bottom:16px;">
            <strong>${faena.descripcion}</strong>
            <div style="font-size:12px;color:#64748b;margin-top:4px;">
              📅 ${faena.fecha} · ${faena.tipo} · ${faena.alcance}
            </div>
          </div>
        `;

        // carga colonos según tipo de faena
        let colonosQuery = supabase.from("colonos").select("*");

        if (faena.alcance === "cuadrilla") {
          const { data: cuadrillas } = await supabase
            .from("faena_cuadrilla")
            .select("cuadrilla_id")
            .eq("faena_id", faena.id);

          const ids = cuadrillas?.map((c) => c.cuadrilla_id) || [];
          if (ids.length > 0) {
            colonosQuery = colonosQuery.in("cuadrilla_id", ids);
          }
        }

        const { data: colonos } = await colonosQuery.order("ap_paterno");

        // carga asistencia ya registrada
        const { data: asistenciaExistente } = await supabase
          .from("asistencia")
          .select("*")
          .eq("faena_id", faena.id);

        const asistenciaMap = {};
        asistenciaExistente?.forEach((a) => {
          asistenciaMap[a.colono_id] = a;
        });

        const lista = root.querySelector("#lista-colonos-asistencia");

        if (!colonos?.length) {
          lista.innerHTML = "<p>No hay colonos asignados a esta faena.</p>";
          return;
        }

        lista.innerHTML = colonos
          .map((c) => {
            const estadoActual = asistenciaMap[c.id]?.estado || "";
            return `
            <div style="display:flex;justify-content:space-between;align-items:center;
              padding:10px 0;border-bottom:1px solid #1e293b;">
              <div>
                <div style="font-size:13px;font-weight:600;">${c.nombre} ${c.ap_paterno}</div>
                <div style="font-size:11px;color:#64748b;">${c.exento ? "⚠️ Exento" : ""}</div>
              </div>
              <select class="input estado-select" data-colono-id="${c.id}" 
                style="width:130px;font-size:12px;">
                <option value="" ${estadoActual === "" ? "selected" : ""}>Sin marcar</option>
                <option value="asistio" ${estadoActual === "asistio" ? "selected" : ""}>✅ Asistió</option>
                <option value="falto" ${estadoActual === "falto" ? "selected" : ""}>❌ Faltó</option>
                <option value="justificado" ${estadoActual === "justificado" ? "selected" : ""}>🤒 Justificado</option>
                <option value="pago" ${estadoActual === "pago" ? "selected" : ""}>💰 Pagó</option>
              </select>
            </div>
          `;
          })
          .join("");

        // ---- GUARDAR ASISTENCIA ----

        root.querySelector("#btn-guardar-asistencia").onclick = async () => {
          const selects = lista.querySelectorAll(".estado-select");
          const nuevos = [];
          const existentes = [];

          selects.forEach((select) => {
            if (!select.value) return;
            const colonoId = parseInt(select.dataset.colonoId);
            const yaExiste = asistenciaMap[colonoId];

            if (yaExiste) {
              existentes.push({
                id: yaExiste.id,
                faena_id: faena.id,
                colono_id: colonoId,
                estado: select.value,
                fue_sustituto: false,
              });
            } else {
              nuevos.push({
                faena_id: faena.id,
                colono_id: colonoId,
                estado: select.value,
                fue_sustituto: false,
              });
            }
          });

          // inserta los nuevos
          if (nuevos.length > 0) {
            const { error } = await supabase.from("asistencia").insert(nuevos);
            if (error) {
              console.log(error);
              alert("Error al guardar asistencia.");
              return;
            }
          }

          // actualiza los existentes
          if (existentes.length > 0) {
            const { error } = await supabase
              .from("asistencia")
              .upsert(existentes, { onConflict: "id" });
            if (error) {
              console.log(error);
              alert("Error al actualizar asistencia.");
              return;
            }
          }

          alert("Asistencia guardada correctamente.");
          await mostrarAsistencia(faena);
        };
      }
    },
  };
}
