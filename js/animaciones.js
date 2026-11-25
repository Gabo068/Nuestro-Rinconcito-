// Diccionario completo de animaciones para la hoja de 8x4 (32 fotogramas)
const ANIMACIONES_OSITO = {
  idle:           { fila: 0, frames: [0, 1, 2, 3], velocidad: 14 }, // Quieto parpadeando
  caminar:        { fila: 0, frames: [4, 5, 6, 7], velocidad: 8 },  // Caminando de frente
  caminarLateral: { fila: 1, frames: [0, 1], velocidad: 8 },        // Caminando de lado
  agacharse:      { fila: 1, frames: [2, 3], velocidad: 14 },       // Agachándose al recoger
  celebrar:       { fila: 1, frames: [4, 5], velocidad: 10 }        // Celebrando con patitas arriba
};

const ANIMACIONES_CONEJITA = {
  idle:     { fila: 2, frames: [0, 1, 2, 3], velocidad: 14 }, // Quietecita y feliz
  saltar:   { fila: 2, frames: [4, 5, 6, 7], velocidad: 8 },  // Saltando de alegría
  caminar:  { fila: 3, frames: [0, 1], velocidad: 8 },        // Caminando de lado
  carino:   { fila: 3, frames: [2, 3], velocidad: 10 },       // Saludando / enviando corazón
  celebrar: { fila: 3, frames: [4, 5], velocidad: 10 }        // Emocionada con corazón
};

const ANIMACION_ABRAZO = {
  pareja: { frames: [[1, 6], [1, 7], [3, 6], [3, 7]], velocidad: 16 } // Abrazo final
};

class GestorSprites {
  // transparentarFondo = false -> Personajes 100% sólidos
  // transparentarFondo = true  -> Objetos con fondo transparente incluso en file://
  constructor(rutasPosibles, columnas = 8, filas = 4, transparentarFondo = false) {
    this.columnas = columnas;
    this.filas = filas;
    this.transparentarFondo = transparentarFondo;
    this.usarMultiplyFallback = false;
    this.lista = false;
    this.canvasLimpio = null;

    const listaRutas = Array.isArray(rutasPosibles) ? rutasPosibles : [rutasPosibles];
    this.cargarConRespaldo(listaRutas, 0);
  }

  cargarConRespaldo(rutas, indice) {
    if (indice >= rutas.length) {
      console.warn("No se encontró la hoja de sprites.");
      return;
    }

    const img = new Image();
    img.src = rutas[indice];

    img.onload = () => {
      this.canvasLimpio = this.procesarSprite(img);
      this.lista = true;
    };

    img.onerror = () => {
      this.cargarConRespaldo(rutas, indice + 1);
    };
  }

  procesarSprite(img) {
    const canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);

    try {
      const cellW = Math.floor(img.width / this.columnas);
      const cellH = Math.floor(img.height / this.filas);
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;

      // Tolerancia un poco mayor en objetos (.jpg) para borrar artefactos alrededor del borde blanco
      const umbral = this.transparentarFondo ? 232 : 242;
      const esFondoBlanco = (idx) =>
        data[idx] > umbral && data[idx + 1] > umbral && data[idx + 2] > umbral;

      for (let r = 0; r < this.filas; r++) {
        for (let c = 0; c < this.columnas; c++) {
          const startX = c * cellW;
          const startY = r * cellH;
          const visitado = new Uint8Array(cellW * cellH);
          const cola = [];

          const agregarSiBlanco = (lx, ly) => {
            if (lx < 0 || ly < 0 || lx >= cellW || ly >= cellH) return;
            const pos = ly * cellW + lx;
            if (visitado[pos]) return;
            const idx = ((startY + ly) * canvas.width + (startX + lx)) * 4;
            if (esFondoBlanco(idx)) {
              visitado[pos] = 1;
              cola.push([lx, ly]);
            }
          };

          for (let x = 0; x < cellW; x++) {
            agregarSiBlanco(x, 0);
            agregarSiBlanco(x, cellH - 1);
          }
          for (let y = 0; y < cellH; y++) {
            agregarSiBlanco(0, y);
            agregarSiBlanco(cellW - 1, y);
          }

          while (cola.length > 0) {
            const [lx, ly] = cola.pop();
            const idx = ((startY + ly) * canvas.width + (startX + lx)) * 4;
            data[idx + 3] = 0; // Fondo exterior transparente

            agregarSiBlanco(lx + 1, ly);
            agregarSiBlanco(lx - 1, ly);
            agregarSiBlanco(lx, ly + 1);
            agregarSiBlanco(lx, ly - 1);
          }

          // Conserva el interior del sprite 100% sólido y opaco
          for (let ly = 0; ly < cellH; ly++) {
            for (let lx = 0; lx < cellW; lx++) {
              const idx = ((startY + ly) * canvas.width + (startX + lx)) * 4;
              if (data[idx + 3] > 0) {
                data[idx + 3] = 255;
              }
            }
          }
        }
      }

      ctx.putImageData(imgData, 0, 0);
    } catch (error) {
      // Si se abre con doble clic (file://):
      // - Personajes se quedan sólidos (source-over)
      // - Objetos activan multiply para ocultar el cuadro blanco
      if (this.transparentarFondo) {
        this.usarMultiplyFallback = true;
      }
    }

    return canvas;
  }

  dibujarFotograma(ctx, fila, columna, dx, dy, anchoDestino, altoDestino, voltearX = false) {
    if (!this.lista) return false;

    const cellW = this.canvasLimpio.width / this.columnas;
    const cellH = this.canvasLimpio.height / this.filas;

    ctx.save();
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = this.usarMultiplyFallback ? "multiply" : "source-over";

    if (voltearX) {
      ctx.translate(dx + anchoDestino, dy);
      ctx.scale(-1, 1);
      ctx.drawImage(
        this.canvasLimpio,
        columna * cellW, fila * cellH, cellW, cellH,
        0, 0, anchoDestino, altoDestino
      );
    } else {
      ctx.drawImage(
        this.canvasLimpio,
        columna * cellW, fila * cellH, cellW, cellH,
        dx, dy, anchoDestino, altoDestino
      );
    }
    ctx.restore();
    return true;
  }
}