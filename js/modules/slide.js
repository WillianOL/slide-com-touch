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
    let moveType; 
    if(event.type === 'mousedown') {
      event.preventDefault();
      this.distancias.comecoX = event.clientX
      moveType = 'mousemove'
    } else {
      this.distancias.comecoX = event.changedTouches[0].clientX
      moveType = 'touchmove'
    }
    this.conteiner.addEventListener(moveType, this.onMove)
  }

  onEnd(event) {
    const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'
    this.conteiner.removeEventListener(moveType, this.onMove)
    this.distancias.posicaoFinal = this.distancias.movePosition
  }

  onMove(event) {
    const pointerPosition = (event.type === 'mousemove') ? event.clientX : event.changedTouches[0].clientX
    const posicaoFinal = this.atualizarPosicao(pointerPosition)
    this.moverSlide(posicaoFinal)
  }

  addSlideEvents() {
    this.conteiner.addEventListener('mousedown', this.onStart)
    this.conteiner.addEventListener('touchstart', this.onStart)
    this.conteiner.addEventListener('mouseup', this.onEnd)
    this.conteiner.addEventListener('touchend', this.onEnd)
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