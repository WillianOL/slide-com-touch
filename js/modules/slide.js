export default class Slide {
  constructor(slide, conteiner) {
    this.slide = document.querySelector(slide);
    this.conteiner = document.querySelector(conteiner);
    this.distancias = { posicaoFinal: 0, comecoX: 0, movimento: 0 }
  }

  moverSlide(distX) {
    this.distancias.movePosition = distX
    this.slide.style.transform = `translate3d(${distX}px, 0, 0)`
  }

  atualizarPosicao(clientX) {
    this.distancias.movimento = (this.distancias.comecoX - clientX) * 1.7;
    return this.distancias.posicaoFinal - this.distancias.movimento
  }

  onStart(event) {
    event.preventDefault();
    this.distancias.comecoX = event.clientX
    this.conteiner.addEventListener('mousemove', this.onMove)
  }

  onEnd() {
    this.conteiner.removeEventListener('mousemove', this.onMove)
    this.distancias.posicaoFinal = this.distancias.movePosition
  }

  onMove(event) {
    const posicaoFinal = this.atualizarPosicao(event.clientX)
    this.moverSlide(posicaoFinal)
  }

  addSlideEvents() {
    this.conteiner.addEventListener('mousedown', this.onStart)
    this.conteiner.addEventListener('mouseup', this.onEnd)
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
  }

  init() {
    this.bindEvents()
    this.addSlideEvents()
    return this
  }
}