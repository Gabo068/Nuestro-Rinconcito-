class ControladorEntrada {
  constructor() {
    this.estado = {
      arriba: false,
      abajo: false,
      izquierda: false,
      derecha: false,
      accion: false
    };
    this.alPulsarAccion = null;
    this.inicializarTeclado();
    this.inicializarTactil();
  }

  inicializarTeclado() {
    window.addEventListener("keydown", (e) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) this.estado.arriba = true;
      if (["ArrowDown", "s", "S"].includes(e.key)) this.estado.abajo = true;
      if (["ArrowLeft", "a", "A"].includes(e.key)) this.estado.izquierda = true;
      if (["ArrowRight", "d", "D"].includes(e.key)) this.estado.derecha = true;

      if (e.key === " " || e.key === "Enter") {
        if (!this.estado.accion && this.alPulsarAccion) {
          this.alPulsarAccion();
        }
        this.estado.accion = true;
      }
    });

    window.addEventListener("keyup", (e) => {
      if (["ArrowUp", "w", "W"].includes(e.key)) this.estado.arriba = false;
      if (["ArrowDown", "s", "S"].includes(e.key)) this.estado.abajo = false;
      if (["ArrowLeft", "a", "A"].includes(e.key)) this.estado.izquierda = false;
      if (["ArrowRight", "d", "D"].includes(e.key)) this.estado.derecha = false;
      if (e.key === " " || e.key === "Enter") this.estado.accion = false;
    });
  }

  inicializarTactil() {
    const botonesDir = document.querySelectorAll(".btn-dir");
    botonesDir.forEach((btn) => {
      const dir = btn.dataset.dir;

      const activar = (e) => {
        e.preventDefault();
        this.estado[dir] = true;
        btn.classList.add("activo");
      };

      const desactivar = (e) => {
        e.preventDefault();
        this.estado[dir] = false;
        btn.classList.remove("activo");
      };

      btn.addEventListener("pointerdown", activar);
      btn.addEventListener("pointerup", desactivar);
      btn.addEventListener("pointerleave", desactivar);
      btn.addEventListener("pointercancel", desactivar);
    });

    const btnAccion = document.getElementById("btn-accion");
    btnAccion.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      if (this.alPulsarAccion) this.alPulsarAccion();
    });
  }
}