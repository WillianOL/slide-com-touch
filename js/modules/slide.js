export default class Slide {
  constructor(slide, conteiner) {
    this.slide = document.querySelector(slide);
    this.conteiner = document.querySelector(conteiner);
  }

  onStart(event) {
    event.preventDefault();
    this.conteiner.addEventListener('mousemove', this.onMove)
  }

  onEnd() {;
    this.conteiner.removeEventListener('mousemove', this.onMove)
  }

  onMove(event) {
    
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