import debounce from "./debounce.js";

export class Slide {
  constructor(slide, conteiner) {
    this.slide = document.querySelector(slide);
    this.conteiner = document.querySelector(conteiner);
    this.distancias = { posicaoFinal: 0, comecoX: 0, movimento: 0 }
    this.activeClass = 'ativo'
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
    this.changeAtiveClass()
  }

  changeAtiveClass() {
    for(const item of this.slideArray) item.element.classList.remove(this.activeClass)
    this.slideArray[this.index.ativo].element.classList.add(this.activeClass)
  }

  activePrevSlide() {
    if (this.index.anterior !== undefined) this.changeSlide(this.index.anterior)
  }

  activeNextSlide() {
    if (this.index.proximo !== undefined) this.changeSlide(this.index.proximo)
  }

  onResize() {
    setTimeout(() => {
      this.slidesConfig();
      this.changeSlide(this.index.ativo)
    }, 800) 
  }

  addResizeEvent() {
    window.addEventListener('resize', this.onResize)
  }

  bindEvents() {
    this.onStart = this.onStart.bind(this)
    this.onMove = this.onMove.bind(this)
    this.onEnd = this.onEnd.bind(this)
    this.activePrevSlide = this.activePrevSlide.bind(this)
    this.activeNextSlide = this.activeNextSlide.bind(this)
    this.onResize = debounce(this.onResize.bind(this), 200)
  }

  init() {
    this.bindEvents()
    this.transition(true)
    this.slidesConfig()
    this.addSlideEvents()
    this.addResizeEvent()
    this.changeSlide(2)
    return this
  }
}

export class SlideNav extends Slide {
  addArrow(anterior, proximo) {
    this.botaoAnterior = document.querySelector(anterior);
    this.botaoProximo = document.querySelector(proximo)
    this.addArrowEvents()
  }

  addArrowEvents() {
    this.botaoAnterior.addEventListener('click', this.activePrevSlide)
    this.botaoProximo.addEventListener('click', this.activeNextSlide)
  }
}