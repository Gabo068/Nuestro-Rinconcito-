// =========================================================================
// PERSONALIZA AQUÍ TUS CARTAS, LAS 11 FOTOGRAFÍAS Y LA DEDICATORIA FINAL
// =========================================================================
const PERSONALIZA_AQUI = {
  // Usa {JUGADOR} y {PAREJA} para que cambien solos según el personaje elegido
  cartas: [
    {
      id: "carta_1",
      titulo: "Carta #1 de {PAREJA} 💌",
      texto:
        "¡Hola, {JUGADOR}! Te preparé una sorpresa en nuestro rincón escondido del bosque. " +
        "Sal por la puerta de arriba hacia El jardín de las flores y junta 5 florecitas para mí. ❤️"
    },
    {
      id: "carta_2",
      titulo: "Carta #2 — Entre flores 🌸",
      texto:
        "Cada flor de este camino me recuerda a tu sonrisa, {JUGADOR}. Sigue hacia el norte para encontrarnos " +
        "en El lago de los recuerdos. ¡Allí te espero!"
    },
    {
      id: "carta_3",
      titulo: "Carta #3 — Bajo las estrellas ✨",
      texto:
        "Ya casi llegas a nuestro refugio secreto. Enciende las 4 estrellas del sendero " +
        "para iluminar nuestro último paso juntos. ❤️"
    }
  ],

  // 11 FOTOGRAFÍAS (guarda tus archivos en assets/recuerdos/foto1.jpg ... foto11.jpg)
  recuerdos: [
    { id: "foto_1",  pista: "01. La casita inicial",          fecha: "Recuerdo #01", titulo: "Nuestro comienzo ❤️",      imagen: "assets/recuerdos/foto1.jpg",  descripcion: "Escribe aquí la historia de su primera foto." },
    { id: "foto_2",  pista: "02. El jardín de las flores",    fecha: "Recuerdo #02", titulo: "Tu sonrisa favorita ✨",   imagen: "assets/recuerdos/foto2.jpg",  descripcion: "Escribe aquí un momento bonito juntos." },
    { id: "foto_3",  pista: "02. El jardín de las flores",    fecha: "Recuerdo #03", titulo: "Aventuras juntos 🐻🐰",    imagen: "assets/recuerdos/foto3.jpg",  descripcion: "Cada salida contigo se vuelve especial." },
    { id: "foto_4",  pista: "02. El jardín de las flores",    fecha: "Recuerdo #04", titulo: "Tarde inolvidable 🌸",     imagen: "assets/recuerdos/foto4.jpg",  descripcion: "Un instante que siempre llevo conmigo." },
    { id: "foto_5",  pista: "03. El lago de los recuerdos",   fecha: "Recuerdo #05", titulo: "Miradas que hablan 💕",    imagen: "assets/recuerdos/foto5.jpg",  descripcion: "Cuando el tiempo se detiene contigo." },
    { id: "foto_6",  pista: "03. El lago de los recuerdos",   fecha: "Recuerdo #06", titulo: "Risas infinitas 😂❤️",     imagen: "assets/recuerdos/foto6.jpg",  descripcion: "Mi lugar favorito siempre es a tu lado." },
    { id: "foto_7",  pista: "03. El lago de los recuerdos",   fecha: "Recuerdo #07", titulo: "Nuestro pequeño mundo 🌎", imagen: "assets/recuerdos/foto7.jpg",  descripcion: "Gracias por hacerme tan feliz." },
    { id: "foto_8",  pista: "04. El sendero de las estrellas", fecha: "Recuerdo #08", titulo: "Bajo el mismo cielo ⭐",  imagen: "assets/recuerdos/foto8.jpg",  descripcion: "Brillas más que todas las estrellas." },
    { id: "foto_9",  pista: "04. El sendero de las estrellas", fecha: "Recuerdo #09", titulo: "Abrazos que curan 🤗",    imagen: "assets/recuerdos/foto9.jpg",  descripcion: "El mejor refugio del mundo." },
    { id: "foto_10", pista: "04. El sendero de las estrellas", fecha: "Recuerdo #10", titulo: "Cómplices de vida 💫",    imagen: "assets/recuerdos/foto10.jpg", descripcion: "Contigo todo vale la pena." },
    { id: "foto_11", pista: "05. Nuestro pequeño refugio",    fecha: "Recuerdo #11", titulo: "Para siempre tú y yo ❤️",  imagen: "assets/recuerdos/foto11.jpg", descripcion: "Nuestro recuerdo final en este rinconcito." }
  ],

  dedicatoriaFinal:
    "“Para el amor de mi vida. Este pequeño mundo es para ti, porque incluso en los lugares " +
    "más pequeños siempre encuentro una razón para sonreír cuando estoy contigo. ❤️”"
};
// =========================================================================

const canvas = document.getElementById("juego-canvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const entrada = new ControladorEntrada();
const sonido = new GestorSonido();

const spritesPersonajes = new GestorSprites([
  "assets/personajes/Hoja de sprites_ osito y conejita adorables.png",
  "assets/personajes/hoja_sprites_original.png"
], 8, 4, false); // false = personajes 100% sólidos y opacos

const spritesObjetos = new GestorSprites([
  "assets/objetos/hoja_objetos.jpg",
  "assets/objetos/hoja_objetos.png"
], 4, 2, true);  // true = objetos con fondo transparente

function cargarFondo(rutas) {
  const img = new Image();
  let i = 0;
  const intentar = () => { if (i < rutas.length) img.src = rutas[i++]; };
  img.onload = () => { img.cargada = true; };
  img.onerror = intentar;
  intentar();
  return img;
}

const fondos = {
  1: cargarFondo(["assets/escenarios/casita_osito.jpg", "assets/escenarios/casita_osito.png"]),
  2: cargarFondo(["assets/escenarios/jardin_flores.jpg", "assets/escenarios/jardin_flores.png"]),
  3: cargarFondo(["assets/escenarios/lago_recuerdos.jpg", "assets/escenarios/lago_recuerdos.png"]),
  4: cargarFondo(["assets/escenarios/sendero_estrellas.jpg", "assets/escenarios/sendero_estrellas.png"]),
  5: cargarFondo(["assets/escenarios/pequeno_refugio.jpg", "assets/escenarios/pequeno_refugio.png"])
};

const progreso = JSON.parse(localStorage.getItem("nuestro_rinconcito_v3")) || {
  personajeElegido: "osito",
  cartasLeidas: [],
  recuerdosEncontrados: [],
  floresRecogidas: [],
  memoriaCompletada: false,
  estrellasEncendidas: []
};

if (!progreso.personajeElegido) progreso.personajeElegido = "osito";

const jugador = new PersonajeJugable(130, 235, spritesPersonajes, progreso.personajeElegido);
const parejaInicial = progreso.personajeElegido === "osito" ? "conejita" : "osito";
const parejaLago = new CompaneroNPC(185, 165, spritesPersonajes, parejaInicial);
const parejaRefugio = new CompaneroNPC(140, 145, spritesPersonajes, parejaInicial);

let escenarioActual = 1;
let abrazoActivado = false;

function nombresPareja() {
  return progreso.personajeElegido === "conejita"
    ? { jugador: "Conejita", pareja: "Osito", emojiPareja: "🐻" }
    : { jugador: "Osito", pareja: "Conejita", emojiPareja: "🐰" };
}

function formatearTexto(texto) {
  const { jugador: nomJ, pareja: nomP } = nombresPareja();
  return texto.replaceAll("{JUGADOR}", nomJ).replaceAll("{PAREJA}", nomP);
}

function guardarProgreso() {
  localStorage.setItem("nuestro_rinconcito_v3", JSON.stringify(progreso));
  actualizarHUD();
}

function seleccionarPersonaje(tipo) {
  progreso.personajeElegido = tipo;
  const tipoPareja = tipo === "osito" ? "conejita" : "osito";

  jugador.establecerTipo(tipo);
  parejaLago.establecerTipo(tipoPareja);
  parejaRefugio.establecerTipo(tipoPareja);

  document.querySelectorAll(".btn-personaje").forEach((btn) => {
    btn.classList.toggle("activo", btn.dataset.personaje === tipo);
  });

  guardarProgreso();
}

document.querySelectorAll(".btn-personaje").forEach((btn) => {
  btn.addEventListener("click", () => {
    seleccionarPersonaje(btn.dataset.personaje);
  });
});

function actualizarHUD() {
  const { jugador: nomJ } = nombresPareja();
  const nombresEscenarios = {
    1: `01. La casita de ${nomJ}`,
    2: "02. El jardín de las flores",
    3: "03. El lago de los recuerdos",
    4: "04. El sendero de las estrellas",
    5: "05. Nuestro pequeño refugio"
  };

  document.getElementById("nombre-escenario").textContent = nombresEscenarios[escenarioActual];
  const fotosTxt = `📸${progreso.recuerdosEncontrados.length}/11`;

  let extra = "";
  if (escenarioActual === 1) extra = `💌${progreso.cartasLeidas.includes("carta_1") ? 1 : 0}/1`;
  if (escenarioActual === 2) extra = `🌸${progreso.floresRecogidas.length}/5`;
  if (escenarioActual === 3) extra = progreso.memoriaCompletada ? "❤️Listo" : "🃏Reto";
  if (escenarioActual === 4) extra = `⭐${progreso.estrellasEncendidas.length}/4`;
  if (escenarioActual === 5) extra = "🎁Final";

  document.getElementById("contador-objetos").textContent = `${extra} ${fotosTxt}`;
}

const objetosPorEscenario = {
  1: [
    { tipo: "carta",    id: "carta_1", x: 144, y: 124, fila: 0, col: 0, etiqueta: "Pulsa A para leer carta" },
    { tipo: "recuerdo", id: "foto_1",  x: 42,  y: 265, fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #01 📸" }
  ],
  2: [
    { tipo: "flor",     id: "flor_1",  x: 52,  y: 295, fila: 1, col: 0, etiqueta: "Pulsa A para recoger flor" },
    { tipo: "flor",     id: "flor_2",  x: 235, y: 280, fila: 1, col: 1, etiqueta: "Pulsa A para recoger flor" },
    { tipo: "flor",     id: "flor_3",  x: 64,  y: 135, fila: 1, col: 2, etiqueta: "Pulsa A para recoger flor" },
    { tipo: "flor",     id: "flor_4",  x: 225, y: 120, fila: 1, col: 0, etiqueta: "Pulsa A para recoger flor" },
    { tipo: "flor",     id: "flor_5",  x: 144, y: 68,  fila: 1, col: 1, etiqueta: "Pulsa A para recoger flor" },
    { tipo: "carta",    id: "carta_2", x: 144, y: 195, fila: 0, col: 0, etiqueta: "Pulsa A para leer cartita" },
    { tipo: "recuerdo", id: "foto_2",  x: 48,  y: 215, fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #02 📸" },
    { tipo: "recuerdo", id: "foto_3",  x: 238, y: 205, fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #03 📸" },
    { tipo: "recuerdo", id: "foto_4",  x: 88,  y: 82,  fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #04 📸" }
  ],
  3: [
    { tipo: "recuerdo", id: "foto_5",  x: 55,  y: 280, fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #05 📸" },
    { tipo: "recuerdo", id: "foto_6",  x: 235, y: 265, fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #06 📸" },
    { tipo: "recuerdo", id: "foto_7",  x: 75,  y: 105, fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #07 📸" }
  ],
  4: [
    { tipo: "estrella", id: "est_1",   x: 68,  y: 275, etiqueta: "Pulsa A para encender estrella ⭐" },
    { tipo: "estrella", id: "est_2",   x: 222, y: 245, etiqueta: "Pulsa A para encender estrella ⭐" },
    { tipo: "estrella", id: "est_3",   x: 72,  y: 130, etiqueta: "Pulsa A para encender estrella ⭐" },
    { tipo: "estrella", id: "est_4",   x: 220, y: 105, etiqueta: "Pulsa A para encender estrella ⭐" },
    { tipo: "carta",    id: "carta_3", x: 144, y: 190, fila: 0, col: 0, etiqueta: "Pulsa A para leer cartita" },
    { tipo: "recuerdo", id: "foto_8",  x: 48,  y: 205, fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #08 📸" },
    { tipo: "recuerdo", id: "foto_9",  x: 238, y: 175, fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #09 📸" },
    { tipo: "recuerdo", id: "foto_10", x: 144, y: 76,  fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #10 📸" }
  ],
  5: [
    { tipo: "recuerdo", id: "foto_11", x: 76,  y: 185, fila: 0, col: 3, etiqueta: "Pulsa A: Recuerdo #11 📸" },
    { tipo: "regalo",   id: "regalo",  x: 212, y: 185, fila: 1, col: 3, etiqueta: "Pulsa A para abrir regalo 🎁" }
  ]
};

function obtenerObjetosVisibles() {
  const lista = objetosPorEscenario[escenarioActual] || [];
  return lista.filter((obj) => {
    if (obj.tipo === "flor") return !progreso.floresRecogidas.includes(obj.id);
    if (obj.tipo === "recuerdo") return !progreso.recuerdosEncontrados.includes(obj.id);
    return true;
  });
}

function puedeAvanzarArriba() {
  if (escenarioActual === 1) return progreso.cartasLeidas.includes("carta_1");
  if (escenarioActual === 2) return progreso.floresRecogidas.length >= 5;
  if (escenarioActual === 3) return progreso.memoriaCompletada;
  if (escenarioActual === 4) return progreso.estrellasEncendidas.length >= 4;
  return false;
}

function dibujarEscenario() {
  const imgFondo = fondos[escenarioActual];
  if (imgFondo && imgFondo.cargada) {
    ctx.drawImage(imgFondo, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#8ab060";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  if (puedeAvanzarArriba()) {
    ctx.fillStyle = "rgba(201, 91, 118, 0.92)";
    ctx.fillRect(104, 6, 112, 20);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 9px Courier New";
    ctx.fillText("SIGUIENTE ▲", 124, 19);
  }

  if (escenarioActual > 1) {
    ctx.fillStyle = "rgba(67, 40, 24, 0.82)";
    ctx.fillRect(116, canvas.height - 22, 88, 18);
    ctx.fillStyle = "#fff6eb";
    ctx.font = "bold 9px Courier New";
    ctx.fillText("REGRESAR ▼", 128, canvas.height - 10);
  }

  const flotar = Math.sin(Date.now() / 240) * 2;
  for (const obj of obtenerObjetosVisibles()) {
    if (obj.tipo === "estrella") {
      const encendida = progreso.estrellasEncendidas.includes(obj.id);
      ctx.fillStyle = encendida ? "rgba(255, 225, 100, 0.45)" : "rgba(255, 255, 255, 0.18)";
      ctx.beginPath();
      ctx.arc(obj.x + 16, obj.y + 16, encendida ? 18 : 13, 0, Math.PI * 2);
      ctx.fill();
      ctx.font = "20px serif";
      ctx.fillText(encendida ? "🌟" : "⭐", obj.x + 4, obj.y + 23 + flotar);
      continue;
    }

    const colDibujo =
      obj.tipo === "carta" && progreso.cartasLeidas.includes(obj.id) ? 1 : obj.col;

    spritesObjetos.dibujarFotograma(
      ctx,
      obj.fila,
      colDibujo,
      obj.x,
      Math.round(obj.y + flotar),
      32,
      32
    );
  }

  if (escenarioActual === 3) {
    parejaLago.actualizar();
    parejaLago.dibujar(ctx);
  }

  if (escenarioActual === 5) {
    parejaRefugio.actualizar();
    parejaRefugio.dibujar(ctx);

    if (abrazoActivado) {
      const subir = (Date.now() / 35) % 28;
      ctx.font = "16px serif";
      ctx.fillText("❤️", parejaRefugio.x + 6, parejaRefugio.y - subir);
      ctx.fillText("💕", parejaRefugio.x + 38, parejaRefugio.y - subir * 0.7);
    }
  }
}

function buscarInteraccionCercana() {
  const cx = jugador.x + jugador.ancho / 2;
  const cy = jugador.y + jugador.alto / 2;
  const { pareja: nomP, emojiPareja } = nombresPareja();

  for (const obj of obtenerObjetosVisibles()) {
    if (Math.hypot(cx - (obj.x + 16), cy - (obj.y + 16)) < 46) return obj;
  }

  if (escenarioActual === 3) {
    const distC = Math.hypot(cx - (parejaLago.x + 29), cy - (parejaLago.y + 29));
    if (distC < 56) {
      return {
        tipo: "pareja_lago",
        etiqueta: progreso.memoriaCompletada
          ? `Pulsa A para saludar a ${nomP} ${emojiPareja}`
          : `Pulsa A para jugar con ${nomP} 🃏`
      };
    }
  }

  if (escenarioActual === 5) {
    const distR = Math.hypot(cx - (parejaRefugio.x + 29), cy - (parejaRefugio.y + 29));
    if (distR < 58) {
      return { tipo: "pareja_refugio", etiqueta: `Pulsa A para abrazar a ${nomP} ❤️` };
    }
  }

  return null;
}

function cambiarEscenario(nuevo, x, y) {
  escenarioActual = nuevo;
  jugador.x = x;
  jugador.y = y;
  abrazoActivado = false;
  parejaRefugio.cambiarEstado("idle");
  actualizarHUD();
}

function abrirMinijuegoMemoria() {
  const { jugador: nomJ, pareja: nomP, emojiPareja } = nombresPareja();
  const iconos = ["❤️", "🌸", "⭐", "💌", "❤️", "🌸", "⭐", "💌"].sort(() => Math.random() - 0.5);
  let seleccionadas = [];
  let parejas = 0;

  const html = `
    <p>Encuentra las 4 parejas de recuerdos junto a ${nomP} para abrir el sendero:</p>
    <div class="grid-memoria" id="tablero-memoria">
      ${iconos.map((ic, idx) => `<button class="carta-memoria" data-idx="${idx}" data-icono="${ic}">?</button>`).join("")}
    </div>
  `;
  abrirModal("El lago de los recuerdos 🃏", html);

  const botones = document.querySelectorAll(".carta-memoria");
  botones.forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.classList.contains("volteada") || btn.classList.contains("emparejada") || seleccionadas.length === 2) return;

      btn.textContent = btn.dataset.icono;
      btn.classList.add("volteada");
      seleccionadas.push(btn);

      if (seleccionadas.length === 2) {
        const [a, b] = seleccionadas;
        if (a.dataset.icono === b.dataset.icono) {
          sonido.efectoRecoger();
          a.classList.add("emparejada");
          b.classList.add("emparejada");
          seleccionadas = [];
          parejas++;

          if (parejas === 4) {
            progreso.memoriaCompletada = true;
            guardarProgreso();
            parejaLago.cambiarEstado("saltar");
            setTimeout(() => {
              abrirModal(
                `¡Lo lograste, ${nomJ}! ${emojiPareja}❤️`,
                `<p>${nomP} salta de alegría. ¡El camino norte hacia <strong>El sendero de las estrellas</strong> ya está abierto!</p>`
              );
            }, 450);
          }
        } else {
          setTimeout(() => {
            a.textContent = "?";
            b.textContent = "?";
            a.classList.remove("volteada");
            b.classList.remove("volteada");
            seleccionadas = [];
          }, 600);
        }
      }
    });
  });
}

entrada.alPulsarAccion = () => {
  const enJuego = document.getElementById("pantalla-juego").classList.contains("activa");
  const modalCerrado = document.getElementById("modal-overlay").classList.contains("oculto");
  if (!enJuego || !modalCerrado) return;

  const item = buscarInteraccionCercana();
  if (!item) return;

  const { pareja: nomP, emojiPareja } = nombresPareja();

  if (item.tipo === "carta") {
    sonido.efectoCarta();
    if (!progreso.cartasLeidas.includes(item.id)) {
      progreso.cartasLeidas.push(item.id);
      guardarProgreso();
    }
    jugador.cambiarEstado("celebrar");
    const carta = PERSONALIZA_AQUI.cartas.find((c) => c.id === item.id);
    abrirModal(
      formatearTexto(carta.titulo),
      `<div class="carta-pergamino"><p>${formatearTexto(carta.texto)}</p></div>`
    );
  }

  if (item.tipo === "flor") {
    sonido.efectoRecoger();
    jugador.ejecutarAccionTemporal("agacharse", 26);
    progreso.floresRecogidas.push(item.id);
    guardarProgreso();
    if (progreso.floresRecogidas.length === 5) {
      setTimeout(() => {
        jugador.cambiarEstado("celebrar");
        abrirModal("¡Ramo listo! 💐", "<p>Juntaste las 5 flores. ¡Avanza hacia el norte al <strong>Lago de los recuerdos</strong>!</p>");
      }, 420);
    }
  }

  if (item.tipo === "recuerdo") {
    sonido.efectoCarta();
    jugador.ejecutarAccionTemporal("agacharse", 26);
    progreso.recuerdosEncontrados.push(item.id);
    guardarProgreso();
    const rec = PERSONALIZA_AQUI.recuerdos.find((r) => r.id === item.id);
    abrirModal(`¡Encontraste ${rec.fecha}! 📸`, renderizarTarjetaRecuerdo(rec));
  }

  if (item.tipo === "pareja_lago") {
    sonido.efectoCarta();
    if (!progreso.memoriaCompletada) {
      abrirMinijuegoMemoria();
    } else {
      parejaLago.cambiarEstado("carino");
      abrirModal(`${nomP} ${emojiPareja}💕`, "<p>¡Te espero en nuestro refugio secreto al final del sendero de las estrellas!</p>");
    }
  }

  if (item.tipo === "estrella") {
    if (!progreso.estrellasEncendidas.includes(item.id)) {
      sonido.efectoRecoger();
      progreso.estrellasEncendidas.push(item.id);
      guardarProgreso();
      if (progreso.estrellasEncendidas.length === 4) {
        jugador.cambiarEstado("celebrar");
        abrirModal("¡Sendero iluminado! ✨", "<p>Las 4 estrellas brillan. ¡Camina hacia el norte para entrar a <strong>Nuestro pequeño refugio</strong>!</p>");
      }
    }
  }

  if (item.tipo === "regalo") {
    sonido.efectoCarta();
    jugador.cambiarEstado("celebrar");
    abrirModal(
      `Regalo sorpresa de ${nomP} 🎁`,
      `<p>Un vale infinito por abrazos, besos y aventuras juntos.</p>
       <div class="dedicatoria-final-caja">${PERSONALIZA_AQUI.dedicatoriaFinal}</div>`
    );
  }

  if (item.tipo === "pareja_refugio") {
    sonido.efectoCarta();
    abrazoActivado = true;
    parejaRefugio.cambiarEstado("abrazo");
    abrirModal(
      "Nuestro Rinconcito ❤️",
      `<p style="text-align:center;">Osito y Conejita por fin se reunieron.</p>
       <div class="dedicatoria-final-caja">${PERSONALIZA_AQUI.dedicatoriaFinal}</div>
       <p style="text-align:center; margin-top:10px; font-size:0.8rem;">
         Fotografías desbloqueadas: <strong>${progreso.recuerdosEncontrados.length} / 11</strong> 📸
       </p>`
    );
  }
};

function renderizarTarjetaRecuerdo(rec) {
  return `
    <div class="tarjeta-polaroid">
      <img src="${rec.imagen}" alt="${rec.titulo}"
           onerror="this.style.display='none'; this.nextElementSibling.style.display='block';" />
      <div class="marco-foto-vacio" style="display:none;">
        📸 Guarda esta foto en:<br><strong>${rec.imagen}</strong>
      </div>
      <div class="polaroid-fecha">${rec.fecha} — ${rec.titulo}</div>
      <p class="polaroid-texto">${rec.descripcion}</p>
    </div>
  `;
}

function abrirModal(titulo, htmlContenido) {
  document.getElementById("modal-titulo").textContent = titulo;
  document.getElementById("modal-contenido").innerHTML = htmlContenido;
  document.getElementById("modal-overlay").classList.remove("oculto");
}

document.getElementById("btn-cerrar-modal").addEventListener("click", () => {
  document.getElementById("modal-overlay").classList.add("oculto");
  if (jugador.estado === "celebrar") jugador.cambiarEstado("idle");
});

document.getElementById("btn-comenzar").addEventListener("click", () => {
  sonido.iniciarContexto();
  sonido.iniciarMusica();
  document.getElementById("pantalla-inicio").classList.remove("activa");
  document.getElementById("pantalla-juego").classList.add("activa");
  actualizarHUD();
});

document.getElementById("btn-menu").addEventListener("click", () => {
  document.getElementById("pantalla-juego").classList.remove("activa");
  document.getElementById("pantalla-inicio").classList.add("activa");
});

document.getElementById("btn-cartitas").addEventListener("click", () => {
  const { jugador: nomJ } = nombresPareja();
  const desbloqueadas = PERSONALIZA_AQUI.cartas.filter((c) => progreso.cartasLeidas.includes(c.id));
  if (desbloqueadas.length === 0) {
    abrirModal("Cartitas 💌", `<p>Aún no has leído ninguna cartita. ¡Empieza en <strong>La casita de ${nomJ}</strong>!</p>`);
    return;
  }
  const html = desbloqueadas
    .map((c) => `<div class="carta-pergamino"><h3>${formatearTexto(c.titulo)}</h3><p>${formatearTexto(c.texto)}</p></div>`)
    .join("");
  abrirModal(`Cartitas (${desbloqueadas.length}/3) 💌`, html);
});

document.getElementById("btn-recuerdos").addEventListener("click", () => {
  const totalEncontradas = progreso.recuerdosEncontrados.length;
  const tarjetas = PERSONALIZA_AQUI.recuerdos
    .map((rec) => {
      if (progreso.recuerdosEncontrados.includes(rec.id)) {
        return renderizarTarjetaRecuerdo(rec);
      }
      return `
        <div class="tarjeta-bloqueada">
          🔒 <strong>${rec.fecha}</strong> bloqueado<br>
          <span>Pista: explora <em>${rec.pista}</em></span>
        </div>
      `;
    })
    .join("");

  abrirModal(`Nuestros recuerdos (${totalEncontradas}/11) 📸`, tarjetas);
});

document.getElementById("btn-sonido").addEventListener("click", (e) => {
  const activo = sonido.alternar();
  e.target.textContent = `Sonido: ${activo ? "Activado" : "Silenciado"}`;
});

// Reiniciar partida desde el menú principal
document.getElementById("btn-reiniciar").addEventListener("click", () => {
  abrirModal(
    "¿Reiniciar partida? 🔄",
    `<p>Se borrarán las cartas leídas, las flores, el minijuego y las 11 fotografías desbloqueadas para empezar la aventura desde cero.</p>
     <div class="acciones-confirmar">
       <button id="btn-confirmar-reinicio" class="btn-pixel peligro">Sí, reiniciar</button>
       <button id="btn-cancelar-reinicio" class="btn-pixel">Cancelar</button>
     </div>`
  );

  document.getElementById("btn-confirmar-reinicio").addEventListener("click", () => {
    const personajeActual = progreso.personajeElegido;
    localStorage.removeItem("nuestro_rinconcito_v3");

    progreso.personajeElegido = personajeActual;
    progreso.cartasLeidas = [];
    progreso.recuerdosEncontrados = [];
    progreso.floresRecogidas = [];
    progreso.memoriaCompletada = false;
    progreso.estrellasEncendidas = [];

    cambiarEscenario(1, 130, 235);
    guardarProgreso();
    document.getElementById("modal-overlay").classList.add("oculto");
  });

  document.getElementById("btn-cancelar-reinicio").addEventListener("click", () => {
    document.getElementById("modal-overlay").classList.add("oculto");
  });
});

function buclePrincipal() {
  const limites = { minX: 20, maxX: canvas.width - 20, minY: 28, maxY: canvas.height - 12 };
  jugador.actualizar(entrada.estado, limites);

  if (puedeAvanzarArriba() && jugador.y <= 34 && jugador.x > 105 && jugador.x < 175) {
    cambiarEscenario(escenarioActual + 1, 130, 320);
  }

  if (escenarioActual > 1 && jugador.y >= canvas.height - jugador.alto - 14 && jugador.x > 105 && jugador.x < 175) {
    cambiarEscenario(escenarioActual - 1, 130, 52);
  }

  dibujarEscenario();
  if (!abrazoActivado) {
    jugador.dibujar(ctx);
  }

  const aviso = document.getElementById("aviso-accion");
  const cercano = buscarInteraccionCercana();
  if (cercano) {
    aviso.textContent = cercano.etiqueta;
    aviso.classList.remove("oculto");
  } else {
    aviso.classList.add("oculto");
  }

  requestAnimationFrame(buclePrincipal);
}

// Inicializar selección guardada y arrancar
seleccionarPersonaje(progreso.personajeElegido);
buclePrincipal();