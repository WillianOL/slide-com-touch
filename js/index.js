import {Slide, SlideNav} from "./modules/slide.js";

const slide = new SlideNav('.slide', '.conteiner')
slide.init()
slide.addArrow('.anterior', '.proximo')
console.log(slide);