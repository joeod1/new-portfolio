import "./default.scss";

import * as masonry from "masonry-layout";

import gsap from "gsap";
import {SplitText} from "gsap/SplitText";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// const hero = document.getElementsByClassName("hero")[0] as HTMLElement;
function fixCanvases() {
    const canvases = Array.from(document.getElementsByClassName("glslCanvas"));
    canvases.forEach((canvas: HTMLCanvasElement) => {
        canvas.height = (canvas.parentElement.clientHeight - 56);
        canvas.width = (canvas.parentElement.clientWidth);
    });
}

fixCanvases();

window.visualViewport.addEventListener('resize', fixCanvases);
// window.addEventListener('focus', fixCanvases);
document.addEventListener('fullscreenchange', fixCanvases);


gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

const st = new SplitText(".split", {
    type: "words",
    // tag: "span"
});

gsap.from(st.words, {
    opacity: 0.5,
    // yPercent: -10,
    // rotateX: 60,
    duration: 0.5,
    stagger: 0.1,
    ease: "sine.out",
    
});


gsap.from(st.words, {
    translateY: -8,
    stagger: {
        each: 0.5,
        yoyo: true,
        repeat: -1
    },
    duration: 2,
    ease: "sine.inOut"
});

gsap.from(".glslCanvas", {
    backgroundColor: "black",
    duration: 2,
    ease: "sine.inOut"
});

Array.from(document.getElementsByClassName("wai")).forEach(wai => {
    gsap.from(wai, {
        opacity: 0,
        yPercent: 25,
        // rotateY: 180,
        // perspective: 1,
        // stagger: 0.15,
        scrollTrigger: {
            trigger: wai,
            start: "center bottom",
            onanimationstart: () => { console.log("triggered") }
        }
    });
});

Array.from(document.getElementsByClassName("masonry-grid")).forEach(grid => {
    const msr = new masonry(grid, {
        columnWidth: 0,
        itemSelector: '.project-card'
    });

    // setInterval(() => msr.layout(), 100);
});

// import mermaid from "mermaid";

// mermaid.initialize({
//     securityLevel: 'loose',
//     theme: 'dark'
// });

// canvas.style.height = "100%";
// canvas.style.width = "100%";
// canvas.style.position = "absolute";
// hero.appendChild(canvas);

// const ctx = canvas.getContext("webgl2");

// const buffer = ctx.createBuffer();
// const vertexArray = ctx.createVertexArray();