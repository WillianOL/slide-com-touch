export default class Slide {
  constructor(slide, conteiner) {
    this.slide = document.querySelector(slide);
    this.conteiner = document.querySelector(conteiner);
    this.distancias = { posicaoFinal: 0, comecoX: 0, movimento: 0 }
  }

  transition(active) {
    this.slide.style.transition = active ? 'transform .3s' : ''
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
    this.transition(false)
  }

  onEnd(event) {
    const moveType = (event.type === 'mouseup') ? 'mousemove' : 'touchmove'
    this.conteiner.removeEventListener(moveType, this.onMove)
    this.distancias.posicaoFinal = this.distancias.movePosition
    this.transition(true)
    this.changeSlideOnEnd()
  }

  changeSlideOnEnd() {
    if(this.distancias.movimento > 120 && this.index.proximo !== undefined) {
      this.activeNextSlide()
    } else if (this.distancias.movimento < -120 && this.index.anterior !== undefined) {
      this.activePrevSlide()
    } else {
      this.changeSlide(this.index.ativo)
    }
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

  // slide config
  slidePosition(slide) {
    const margin = (this.conteiner.offsetWidth - slide.offsetWidth) / 2
    return -(slide.offsetLeft - margin)
  }

  slidesConfig() {
    this.slideArray = [...this.slide.children].map((element) => {
      const positionElement = this.slidePosition(element);
      return { element, positionElement }
    });
  }

  slideIndexNav(index) {
    const ultimoSlide = this.slideArray.length - 1
    this.index = {
      anterior: index ? index - 1 : undefined,
      ativo: index,
      proximo: index === ultimoSlide ? undefined : index + 1,
    }
  }

  changeSlide(index) {
    const slideAtivo = this.slideArray[index]
    this.moverSlide(slideAtivo.positionElement)
    this.slideIndexNav(index)
    this.distancias.posicaoFinal = slideAtivo.positionElement
  }

  activePrevSlide() {
    if (this.index.anterior !== undefined) this.changeSlide(this.index.anterior)
  }

  activeNextSlide() {
    if (this.index.proximo !== undefined) this.changeSlide(this.index.proximo)
  }

  init() {
    this.bindEvents()
    this.transition(true)
    this.slidesConfig()
    this.addSlideEvents()
    return this
  }
}