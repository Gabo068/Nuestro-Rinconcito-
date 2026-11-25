class PersonajeJugable {
  constructor(x, y, gestorSprites, tipo = "osito") {
    this.x = x;
    this.y = y;
    this.ancho = 58;
    this.alto = 58;
    this.velocidad = 2.15;
    this.gestorSprites = gestorSprites;

    this.estado = "idle";
    this.mirandoIzquierda = false;
    this.frameActual = 0;
    this.contadorTiempo = 0;
    this.temporizadorAccion = 0;

    this.establecerTipo(tipo);
  }

  establecerTipo(tipo) {
    this.tipo = tipo;
    if (tipo === "conejita") {
      // Mapeo completo para Conejita jugable (filas 2 y 3 de la hoja 8x4)[cite: 2]
      this.animaciones = {
        idle:           { fila: 2, frames: [0, 1, 2, 3], velocidad: 14 },
        caminar:        { fila: 2, frames: [4, 5, 6, 7], velocidad: 8 },
        caminarLateral: { fila: 3, frames: [0, 1], velocidad: 8 },
        agacharse:      { fila: 3, frames: [2, 3], velocidad: 10 },
        celebrar:       { fila: 3, frames: [4, 5], velocidad: 10 }
      };
    } else {
      // Mapeo completo para Osito jugable (filas 0 y 1 de la hoja 8x4)[cite: 2]
      this.animaciones = ANIMACIONES_OSITO;
    }
    this.estado = "idle";
    this.frameActual = 0;
    this.contadorTiempo = 0;
  }

  ejecutarAccionTemporal(estadoAccion, duracionFrames = 28) {
    this.cambiarEstado(estadoAccion);
    this.temporizadorAccion = duracionFrames;
  }

  actualizar(entrada, limites) {
    if (this.temporizadorAccion > 0) {
      this.temporizadorAccion--;
      this.avanzarFotograma();
      if (this.temporizadorAccion === 0) this.cambiarEstado("idle");
      return;
    }

    if (this.estado === "celebrar") {
      this.avanzarFotograma();
      return;
    }

    let dx = 0;
    let dy = 0;

    if (entrada.arriba) dy -= 1;
    if (entrada.abajo) dy += 1;
    if (entrada.izquierda) {
      dx -= 1;
      this.mirandoIzquierda = true;
    }
    if (entrada.derecha) {
      dx += 1;
      this.mirandoIzquierda = false;
    }

    if (dx !== 0 || dy !== 0) {
      const mag = Math.hypot(dx, dy);
      this.x += (dx / mag) * this.velocidad;
      this.y += (dy / mag) * this.velocidad;
      this.cambiarEstado(dx !== 0 ? "caminarLateral" : "caminar");
    } else {
      this.cambiarEstado("idle");
    }

    this.x = Math.max(limites.minX, Math.min(limites.maxX - this.ancho, this.x));
    this.y = Math.max(limites.minY, Math.min(limites.maxY - this.alto, this.y));

    this.avanzarFotograma();
  }

  cambiarEstado(nuevoEstado) {
    if (this.estado !== nuevoEstado) {
      this.estado = nuevoEstado;
      this.frameActual = 0;
      this.contadorTiempo = 0;
    }
  }

  avanzarFotograma() {
    const anim = this.animaciones[this.estado];
    this.contadorTiempo++;
    if (this.contadorTiempo >= anim.velocidad) {
      this.contadorTiempo = 0;
      this.frameActual = (this.frameActual + 1) % anim.frames.length;
    }
  }

  dibujar(ctx) {
    const anim = this.animaciones[this.estado];
    const col = anim.frames[this.frameActual];

    ctx.fillStyle = "rgba(45, 25, 18, 0.24)";
    ctx.beginPath();
    ctx.ellipse(this.x + this.ancho / 2, this.y + this.alto - 6, 15, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const voltear =
      (this.estado === "caminarLateral" || this.estado === "agacharse") &&
      this.mirandoIzquierda;

    this.gestorSprites.dibujarFotograma(
      ctx,
      anim.fila,
      col,
      Math.round(this.x),
      Math.round(this.y),
      this.ancho,
      this.alto,
      voltear
    );
  }
}

class CompaneroNPC {
  constructor(x, y, gestorSprites, tipo = "conejita") {
    this.x = x;
    this.y = y;
    this.ancho = 58;
    this.alto = 58;
    this.gestorSprites = gestorSprites;

    this.tipo = tipo;
    this.estado = "idle"; // idle, saltar, carino, abrazo
    this.frameActual = 0;
    this.contadorTiempo = 0;
  }

  establecerTipo(tipo) {
    this.tipo = tipo;
    this.estado = "idle";
    this.frameActual = 0;
    this.contadorTiempo = 0;
  }

  cambiarEstado(nuevoEstado) {
    if (this.estado !== nuevoEstado) {
      this.estado = nuevoEstado;
      this.frameActual = 0;
      this.contadorTiempo = 0;
    }
  }

  obtenerAnimacionActual() {
    if (this.estado === "abrazo") {
      return { velocidad: 16, frames: ANIMACION_ABRAZO.pareja.frames };
    }

    if (this.tipo === "osito") {
      const mapaOsito = {
        idle:   { velocidad: 14, frames: [[0, 0], [0, 1], [0, 2], [0, 3]] },
        saltar: { velocidad: 10, frames: [[1, 4], [1, 5]] },
        carino: { velocidad: 12, frames: [[1, 3], [1, 4]] }
      };
      return mapaOsito[this.estado] || mapaOsito.idle;
    }

    const mapaConejita = {
      idle:   { velocidad: 14, frames: [[2, 0], [2, 1], [2, 2], [2, 3]] },
      saltar: { velocidad: 8,  frames: [[2, 4], [2, 5], [2, 6], [2, 7]] },
      carino: { velocidad: 10, frames: [[3, 2], [3, 3]] }
    };
    return mapaConejita[this.estado] || mapaConejita.idle;
  }

  actualizar() {
    const anim = this.obtenerAnimacionActual();
    this.contadorTiempo++;
    if (this.contadorTiempo >= anim.velocidad) {
      this.contadorTiempo = 0;
      this.frameActual = (this.frameActual + 1) % anim.frames.length;
    }
  }

  dibujar(ctx) {
    ctx.fillStyle = "rgba(45, 25, 18, 0.24)";
    ctx.beginPath();
    ctx.ellipse(this.x + this.ancho / 2, this.y + this.alto - 6, 16, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    const anim = this.obtenerAnimacionActual();
    const [fila, col] = anim.frames[this.frameActual];

    if (this.estado === "abrazo") {
      this.gestorSprites.dibujarFotograma(
        ctx,
        fila,
        col,
        Math.round(this.x - 8),
        Math.round(this.y),
        74,
        62,
        false
      );
      return;
    }

    this.gestorSprites.dibujarFotograma(
      ctx,
      fila,
      col,
      Math.round(this.x),
      Math.round(this.y),
      this.ancho,
      this.alto,
      false
    );
  }
}