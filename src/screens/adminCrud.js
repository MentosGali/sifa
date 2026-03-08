import { supabase } from "../config/supabase.js";
import bcrypt from "bcryptjs";

export function renderAdminCrud() {
  return {
    html: `
      <article class="crud-admin">
        <p class="eyebrow">CRUD Administrador</p>
        <h2>Gestión de Faenas Comunitarias</h2>

        <!-- MENU -->
        <label><legend>Sección</legend></label>
        <select class="input" id="menu-admin">
          <option value="">Selecciona una sección</option>
          <option value="faenas">Faenas</option>
          <option value="colonos">Colonos</option>
        </select>

       <!-- SECCIÓN FAENAS -->
<section id="seccion-faenas" style="display:none;">
  
  <label>Opciones</label>
  <select class="input" id="opciones-faenas">
    <option value="">Selecciona una opción</option>
    <option value="crear">Crear Faena</option>
    <option value="gestionar">Ver y Gestionar Faenas</option>
  </select>

  <!-- CREAR FAENA -->
  <div id="crear-faena" style="display:none;">
    <h3>Crear Nueva Faena</h3>
    <form id="create-faena-form" class="stack">
      <label>Nombre de la Faena
        <input class="input" name="faena-name" placeholder="Nombre de la faena" required />
      </label>
      <label>Fecha de la Faena
        <input class="input" name="faena-date" type="date" required />
      </label>
      <label>Tipo de Faena
        <select class="input" name="tipo-faena" id="tipo-faena" required>
          <option value="">Selecciona un tipo</option>
          <option value="general">General</option>
          <option value="agua">Agua</option>
        </select>
      </label>
      <label id="cuadrilla-check-container" style="display:none;">
        Es Cuadrilla
        <input type="checkbox" id="es-cuadrilla">
      </label>
      <div id="cuadrilla-container" style="display:none;">
        <label>Cuadrilla
          <select class="input" name="faena-cuadrilla" id="faena-cuadrilla" multiple></select>
        </label>
      </div>
      <p id="faena-error" style="color:red;display:none;">Error al crear la faena.</p>
      <p id="faena-success" style="color:green;display:none;">Faena creada correctamente.</p>
      <button type="submit">Crear Faena</button>
    </form>
  </div>

  <!-- GESTIONAR FAENAS -->
  <div id="gestionar-faenas" style="display:none;">
    <h3>Faenas</h3>
    <div style="display:flex;gap:8px;margin-bottom:12px;">
      <button id="filtro-todas" class="btn-filtro activo">Todas</button>
      <button id="filtro-activas" class="btn-filtro">Activas</button>
      <button id="filtro-cerradas" class="btn-filtro">Cerradas</button>
    </div>
    <div id="lista-faenas"></div>

    <!-- EDITAR FAENA -->
    <form id="form-editar-faena" class="stack" style="display:none;">
      <h4>Editar Faena</h4>
      <label>Nombre
        <input class="input" name="descripcion" required />
      </label>
      <label>Fecha
        <input class="input" name="fecha" type="date" required />
      </label>
      <label>Tipo
        <select class="input" name="tipo">
          <option value="general">General</option>
          <option value="agua">Agua</option>
        </select>
      </label>
      <label>Estado
        <select class="input" name="estado">
          <option value="activa">Activa</option>
          <option value="cerrada">Cerrada</option>
        </select>
      </label>
      <p id="editar-faena-error" style="color:red;display:none;">Error al editar.</p>
      <p id="editar-faena-success" style="color:green;display:none;">Faena actualizada.</p>
      <button type="submit">Guardar cambios</button>
      <button type="button" id="btn-cancelar-editar">Cancelar</button>
    </form>
  </div>

</section>

        <!-- SECCIÓN COLONOS -->
        <section id="seccion-colonos" style="display:none;">
          <h3>Gestión de Colonos</h3>

          <label>Opciones</label>
          <select class="input" id="opciones-colonos">
            <option value="">Selecciona una opción</option>
            <option value="crear">Registrar Colono</option>
            <option value="buscar">Buscar / Editar / Eliminar</option>
          </select>

          <!-- CREAR COLONO -->
          <div id="crear-colono" style="display:none;">
            <form id="form-crear-colono" class="stack">
              <label>Nombre
                <input class="input" name="nombre" required />
              </label>
              <label>Apellido Paterno
                <input class="input" name="ap_paterno" required />
              </label>
              <label>Apellido Materno
                <input class="input" name="ap_materno" required />
              </label>
              <label>Edad
                <input class="input" name="edad" type="number" required />
              </label>
              <label>Teléfono
                <input class="input" name="telefono" />
              </label>
              <label>Cuadrilla
                <select class="input" name="cuadrilla_id" id="select-cuadrilla-crear">
                  <option value="">Sin cuadrilla</option>
                </select>
              </label>
              <label>
                <input type="checkbox" name="exento" />
                Exento (edad avanzada, vive solo)
              </label>
              <label>
                <input type="checkbox" id="check-acceso-crear" />
                Dar acceso al sistema
              </label>
              <div id="acceso-crear" style="display:none;">
                <label>Username
                  <input class="input" name="username" />
                </label>
                <label>Password
                  <input class="input" name="password" type="password" />
                </label>
              </div>
              <p id="crear-error" style="color:red;display:none;">Error al registrar colono.</p>
              <p id="crear-success" style="color:green;display:none;">Colono registrado correctamente.</p>
              <button type="submit">Registrar</button>
            </form>
          </div>

          <!-- BUSCAR / EDITAR / ELIMINAR -->
          <div id="buscar-colono" style="display:none;">
            <div style="display:flex;gap:8px;margin-top:12px;">
              <input class="input" id="input-buscar" placeholder="Nombre o apellido" style="flex:1" />
              <button id="btn-buscar">Buscar</button>
            </div>
            <div id="resultados-busqueda"></div>

            <form id="form-editar-colono" class="stack" style="display:none;">
              <h4>Editar Colono</h4>
              <label>Nombre
                <input class="input" name="nombre" required />
              </label>
              <label>Apellido Paterno
                <input class="input" name="ap_paterno" required />
              </label>
              <label>Apellido Materno
                <input class="input" name="ap_materno" required />
              </label>
              <label>Edad
                <input class="input" name="edad" type="number" required />
              </label>
              <label>Teléfono
                <input class="input" name="telefono" />
              </label>
              <label>Cuadrilla
                <select class="input" name="cuadrilla_id" id="select-cuadrilla-editar">
                  <option value="">Sin cuadrilla</option>
                </select>
              </label>
              <label>
                <input type="checkbox" name="exento" />
                Exento
              </label>
              <p id="editar-error" style="color:red;display:none;">Error al editar colono.</p>
              <p id="editar-success" style="color:green;display:none;">Colono actualizado correctamente.</p>
              <div style="display:flex;gap:8px;">
                <button type="submit">Guardar cambios</button>
                <button type="button" id="btn-eliminar" style="background:red;color:white;">Eliminar</button>
              </div>
            </form>
          </div>
        </section>

      </article>
    `,

    async onMount(root) {
      // carga cuadrillas en todos los selects
      const { data: cuadrillas } = await supabase
        .from("cuadrillas")
        .select("*");

      const llenarSelect = (selectId) => {
        const select = root.querySelector(selectId);
        if (!select) return;
        cuadrillas?.forEach((c) => {
          const op = document.createElement("option");
          op.value = c.id;
          op.textContent = c.nombre;
          select.appendChild(op);
        });
      };

      llenarSelect("#select-cuadrilla-crear");
      llenarSelect("#select-cuadrilla-editar");
      llenarSelect("#faena-cuadrilla");

      // MENU PRINCIPAL
      root.querySelector("#menu-admin").addEventListener("change", (e) => {
        root.querySelector("#seccion-faenas").style.display =
          e.target.value === "faenas" ? "block" : "none";
        root.querySelector("#seccion-colonos").style.display =
          e.target.value === "colonos" ? "block" : "none";
      });

      // ---- FAENAS ----
      const tipoFaena = root.querySelector("#tipo-faena");
      const checkboxCuadrilla = root.querySelector("#es-cuadrilla");
      const cuadrillaCheckContainer = root.querySelector(
        "#cuadrilla-check-container",
      );
      const cuadrillaContainer = root.querySelector("#cuadrilla-container");
      const selectCuadrilla = root.querySelector("#faena-cuadrilla");

      tipoFaena.addEventListener("change", () => {
        if (tipoFaena.value === "agua") {
          cuadrillaCheckContainer.style.display = "block";
        } else {
          cuadrillaCheckContainer.style.display = "none";
          cuadrillaContainer.style.display = "none";
          checkboxCuadrilla.checked = false;
          selectCuadrilla.selectedIndex = -1;
        }
      });

      checkboxCuadrilla.addEventListener("change", () => {
        cuadrillaContainer.style.display = checkboxCuadrilla.checked
          ? "block"
          : "none";
      });

      const formFaena = root.querySelector("#create-faena-form");
      formFaena.addEventListener("submit", async (e) => {
        e.preventDefault();
        root.querySelector("#faena-error").style.display = "none";
        root.querySelector("#faena-success").style.display = "none";

        const usuario = JSON.parse(sessionStorage.getItem("usuario"));

        const { data, error } = await supabase
          .from("faenas")
          .insert({
            descripcion: formFaena.querySelector("[name='faena-name']").value,
            fecha: formFaena.querySelector("[name='faena-date']").value,
            tipo: tipoFaena.value,
            alcance: checkboxCuadrilla.checked ? "cuadrilla" : "general",
            creado_por: usuario.id,
          })
          .select()
          .single();

        if (error) {
          root.querySelector("#faena-error").style.display = "block";
          return;
        }

        if (checkboxCuadrilla.checked) {
          const cuadrillasSeleccionadas = Array.from(
            selectCuadrilla.selectedOptions,
          ).map((op) => ({
            faena_id: data.id,
            cuadrilla_id: parseInt(op.value),
          }));

          if (cuadrillasSeleccionadas.length > 0) {
            await supabase
              .from("faena_cuadrilla")
              .insert(cuadrillasSeleccionadas);
          }
        }

        root.querySelector("#faena-success").style.display = "block";
        formFaena.reset();
        tipoFaena.dispatchEvent(new Event("change"));
      });

      // OPCIONES FAENAS
      root.querySelector("#opciones-faenas").addEventListener("change", (e) => {
        root.querySelector("#crear-faena").style.display =
          e.target.value === "crear" ? "block" : "none";
        root.querySelector("#gestionar-faenas").style.display =
          e.target.value === "gestionar" ? "block" : "none";
        if (e.target.value === "gestionar") cargarFaenas("todas");
      });

      // CARGAR FAENAS
      let faenaSeleccionada = null;

      async function cargarFaenas(filtro) {
        let query = supabase
          .from("faenas")
          .select("*")
          .order("fecha", { ascending: false });
        if (filtro === "activas") query = query.eq("estado", "activa");
        if (filtro === "cerradas") query = query.eq("estado", "cerrada");

        const { data, error } = await query;
        const lista = root.querySelector("#lista-faenas");

        if (error || !data?.length) {
          lista.innerHTML = "<p>No hay faenas.</p>";
          return;
        }

        lista.innerHTML = data
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

        lista.querySelectorAll("[data-id]").forEach((el) => {
          el.addEventListener("click", async () => {
            const faena = data.find((f) => f.id === parseInt(el.dataset.id));
            faenaSeleccionada = faena;

            const { data: asistencia } = await supabase
              .from("asistencia")
              .select("estado")
              .eq("faena_id", faena.id);

            const asistieron =
              asistencia?.filter((a) => a.estado === "asistio").length || 0;
            const faltaron =
              asistencia?.filter((a) => a.estado === "falto").length || 0;
            const justificados =
              asistencia?.filter((a) => a.estado === "justificado").length || 0;

            const form = root.querySelector("#form-editar-faena");
            form.descripcion.value = faena.descripcion;
            form.fecha.value = faena.fecha;
            form.tipo.value = faena.tipo;
            form.estado.value = faena.estado;
            form.style.display = "block";

            let resumen = form.querySelector("#resumen-asistencia");
            if (!resumen) {
              resumen = document.createElement("div");
              resumen.id = "resumen-asistencia";
              resumen.style.cssText =
                "padding:10px;background:#0f172a;border-radius:8px;margin-bottom:12px;font-size:13px;";
              form.prepend(resumen);
            }

            resumen.innerHTML = `
        <strong>Asistencia registrada:</strong><br>
        ✅ Asistieron: ${asistieron} &nbsp;
        ❌ Faltaron: ${faltaron} &nbsp;
        🤒 Justificados: ${justificados}
      `;
          });
        });
      }

      root
        .querySelector("#filtro-todas")
        .addEventListener("click", () => cargarFaenas("todas"));
      root
        .querySelector("#filtro-activas")
        .addEventListener("click", () => cargarFaenas("activas"));
      root
        .querySelector("#filtro-cerradas")
        .addEventListener("click", () => cargarFaenas("cerradas"));

      const formEditarFaena = root.querySelector("#form-editar-faena");
      formEditarFaena.addEventListener("submit", async (e) => {
        e.preventDefault();
        root.querySelector("#editar-faena-error").style.display = "none";
        root.querySelector("#editar-faena-success").style.display = "none";

        const { error } = await supabase
          .from("faenas")
          .update({
            descripcion: formEditarFaena.descripcion.value,
            fecha: formEditarFaena.fecha.value,
            tipo: formEditarFaena.tipo.value,
            estado: formEditarFaena.estado.value,
          })
          .eq("id", faenaSeleccionada.id);

        if (error) {
          root.querySelector("#editar-faena-error").style.display = "block";
          return;
        }

        root.querySelector("#editar-faena-success").style.display = "block";
        cargarFaenas("todas");
      });

      root
        .querySelector("#btn-cancelar-editar")
        .addEventListener("click", () => {
          formEditarFaena.style.display = "none";
          faenaSeleccionada = null;
        });

      // ---- COLONOS ----
      root
        .querySelector("#opciones-colonos")
        .addEventListener("change", (e) => {
          root.querySelector("#crear-colono").style.display =
            e.target.value === "crear" ? "block" : "none";
          root.querySelector("#buscar-colono").style.display =
            e.target.value === "buscar" ? "block" : "none";
        });

      root
        .querySelector("#check-acceso-crear")
        .addEventListener("change", (e) => {
          root.querySelector("#acceso-crear").style.display = e.target.checked
            ? "block"
            : "none";
        });

      // CREAR colono
      const formCrear = root.querySelector("#form-crear-colono");
      formCrear.addEventListener("submit", async (e) => {
        e.preventDefault();
        root.querySelector("#crear-error").style.display = "none";
        root.querySelector("#crear-success").style.display = "none";

        const tieneAcceso = root.querySelector("#check-acceso-crear").checked;
        let passwordFinal = null;

        if (tieneAcceso && formCrear.password.value) {
          passwordFinal = await bcrypt.hash(formCrear.password.value, 10);
        }

        const { error } = await supabase.from("colonos").insert({
          nombre: formCrear.nombre.value,
          ap_paterno: formCrear.ap_paterno.value,
          ap_materno: formCrear.ap_materno.value,
          edad: parseInt(formCrear.edad.value),
          telefono: formCrear.telefono.value,
          cuadrilla_id: formCrear.cuadrilla_id.value || null,
          exento: formCrear.exento.checked,
          tiene_acceso: tieneAcceso,
          username: tieneAcceso ? formCrear.username.value : null,
          password: passwordFinal,
        });

        if (error) {
          root.querySelector("#crear-error").style.display = "block";
          console.log(error);
          return;
        }

        root.querySelector("#crear-success").style.display = "block";
        formCrear.reset();
        root.querySelector("#acceso-crear").style.display = "none";
      });

      // BUSCAR colono
      const formEditar = root.querySelector("#form-editar-colono");

      root.querySelector("#btn-buscar").addEventListener("click", async () => {
        const termino = root.querySelector("#input-buscar").value.trim();
        if (!termino) return;

        const { data, error } = await supabase
          .from("colonos")
          .select("*")
          .or(`nombre.ilike.%${termino}%,ap_paterno.ilike.%${termino}%`);

        const resultados = root.querySelector("#resultados-busqueda");

        if (error || !data?.length) {
          resultados.innerHTML = "<p>No se encontraron colonos.</p>";
          formEditar.style.display = "none";
          return;
        }

        resultados.innerHTML = data
          .map(
            (c) => `
          <div style="padding:10px;border-bottom:1px solid #334155;cursor:pointer;" data-id="${c.id}">
            ${c.nombre} ${c.ap_paterno} ${c.ap_materno}
          </div>
        `,
          )
          .join("");

        resultados.querySelectorAll("[data-id]").forEach((el) => {
          el.addEventListener("click", () => {
            const colono = data.find((c) => c.id === parseInt(el.dataset.id));
            formEditar.id_colono = colono.id;
            formEditar.nombre.value = colono.nombre;
            formEditar.ap_paterno.value = colono.ap_paterno;
            formEditar.ap_materno.value = colono.ap_materno;
            formEditar.edad.value = colono.edad;
            formEditar.telefono.value = colono.telefono || "";
            formEditar.cuadrilla_id.value = colono.cuadrilla_id || "";
            formEditar.exento.checked = colono.exento;
            formEditar.style.display = "block";
            root.querySelector("#editar-error").style.display = "none";
            root.querySelector("#editar-success").style.display = "none";
          });
        });
      });

      // EDITAR colono
      formEditar.addEventListener("submit", async (e) => {
        e.preventDefault();
        root.querySelector("#editar-error").style.display = "none";
        root.querySelector("#editar-success").style.display = "none";

        const { error } = await supabase
          .from("colonos")
          .update({
            nombre: formEditar.nombre.value,
            ap_paterno: formEditar.ap_paterno.value,
            ap_materno: formEditar.ap_materno.value,
            edad: parseInt(formEditar.edad.value),
            telefono: formEditar.telefono.value,
            cuadrilla_id: formEditar.cuadrilla_id.value || null,
            exento: formEditar.exento.checked,
          })
          .eq("id", formEditar.id_colono);

        if (error) {
          root.querySelector("#editar-error").style.display = "block";
          return;
        }

        root.querySelector("#editar-success").style.display = "block";
      });

      // ELIMINAR colono
      root
        .querySelector("#btn-eliminar")
        .addEventListener("click", async () => {
          if (!confirm("¿Seguro que quieres eliminar este colono?")) return;

          const { error } = await supabase
            .from("colonos")
            .delete()
            .eq("id", formEditar.id_colono);

          if (error) {
            root.querySelector("#editar-error").style.display = "block";
            return;
          }

          formEditar.style.display = "none";
          root.querySelector("#resultados-busqueda").innerHTML = "";
          root.querySelector("#input-buscar").value = "";
          root.querySelector("#opciones-colonos").value = "";
          root.querySelector("#buscar-colono").style.display = "none";
        });
    },
  };
}
