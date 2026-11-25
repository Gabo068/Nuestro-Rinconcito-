class GestorSonido {
  constructor() {
    this.activo = true;
    this.ctx = null;
    this.intervaloMusica = null;
    this.notaActual = 0;

    // Melodía suave estilo cajita musical (Do mayor / La menor cálido)
    this.melodia = [
      523.25, 659.25, 783.99, 659.25,
      587.33, 698.46, 880.00, 698.46,
      493.88, 587.33, 783.99, 587.33,
      523.25, 659.25, 523.25, 0
    ];
  }

  iniciarContexto() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  tocarNota(frecuencia, duracion = 0.35, volumen = 0.04, tipo = "sine") {
    if (!this.activo || !frecuencia) return;
    this.iniciarContexto();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = tipo;
    osc.frequency.setValueAtTime(frecuencia, this.ctx.currentTime);

    gain.gain.setValueAtTime(volumen, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duracion);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(this.ctx.currentTime + duracion);
  }

  iniciarMusica() {
    if (this.intervaloMusica) return;
    this.intervaloMusica = setInterval(() => {
      if (!this.activo) return;
      const freq = this.melodia[this.notaActual];
      this.tocarNota(freq, 0.55, 0.03, "sine");
      this.notaActual = (this.notaActual + 1) % this.melodia.length;
    }, 620);
  }

  efectoRecoger() {
    this.tocarNota(587.33, 0.15, 0.06, "triangle");
    setTimeout(() => this.tocarNota(880.00, 0.25, 0.06, "triangle"), 110);
  }

  efectoCarta() {
    this.tocarNota(523.25, 0.18, 0.06, "sine");
    setTimeout(() => this.tocarNota(659.25, 0.18, 0.06, "sine"), 120);
    setTimeout(() => this.tocarNota(783.99, 0.32, 0.06, "sine"), 240);
  }

  alternar() {
    this.activo = !this.activo;
    if (this.activo) this.iniciarContexto();
    return this.activo;
  }
}