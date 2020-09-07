import { Color, Widget } from "@huckleberrylabs/ping-core";
import { ElementIDs } from "./elements";

/* export const InsertCSS = (css: string) => (shadow: ShadowRoot) => {
  const style = document.createElement("style");
  style.type = "text/css";
  style.innerHTML = css;
  // const head = document.getElementsByTagName("head")[0];
  shadow.appendChild(style);
}; */

export const GenerateCSS = (e: ElementIDs) => (w: Widget.Settings.Model.T) =>
  `
@namespace svg "http://www.w3.org/2000/svg";
  
:root {
  --huckleberry-ping-accent-color: ${w.color};
  --huckleberry-ping-accent-contrast-color:  ${
    Color.IsLight(w.color) ? "black" : "white"
  };
  --huckleberry-ping-background-color: #f7f7f7;
  --huckleberry-ping-invalid-color: #fdd;
  --huckleberry-ping-success-color: #00ae4e;
  --huckleberry-ping-fail-color: #ae0034;
}
#${e.container} :not(svg|*) {
  all: revert;
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}
#${e.container} {
  all: revert;
  position: fixed;
  z-index: 2147483647;
  bottom: ${w.yOffset + 5}px;
  right: ${w.xOffset + 5}px;
  width: 54px;
  max-width: 90vw;
  height: 54px;
  border-radius: 8px;
  transition: width 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  background-color: var(--huckleberry-ping-background-color);
  box-shadow: 0 3px 7px rgba(0, 0, 0, 0.25);
}
#${e.form} {
  width: 100%;
  height: 100%;
}
#${e.form} button,
#${e.form} input,
#${e.loader},
#${e.success},
#${e.error} {
  position: absolute;
  height: 100%;
  border: none;
  outline: none;
  top: 0;
  right: 0;
  bottom: 0;
  transform: scale(0);
  opacity: 0;
}
#${e.form} button {
  width: 20%;
  padding: 0;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--huckleberry-ping-accent-color);
  color: var(--huckleberry-ping-accent-contrast-color);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}
#${e.form} input {
  left: 0;
  width: 78%;
  background-color: var(--huckleberry-ping-background-color);
  box-sizing: border-box;
  padding: 0 20px;
}

#${e.form} input:invalid {
  background-color: var(--huckleberry-ping-invalid);
}

#${e.form} .shown {
  transition: all 0.4s ease 0.4s;
  transform: scale(1);
  opacity: 1;
}

#${e.form} button.shown {
  transform: scale(1.2);
}

#${e.cancel} {
  top: -20px;
  border-radius: 50%;
  height: 15px;
  width: 15px;
  right: 20px;
  position: relative;
  background-color: var(--huckleberry-ping-fail-color);
}

#${e.cancel} line {
  stroke: white;
  stroke-linecap: round;
  stroke-width: 2;
}

#${e.loader}.shown,
#${e.success}.shown,
#${e.error}.shown {
  transition: opacity 0.4s ease 0.4s;
  transform: scale(1);
  opacity: 1;
}

#${e.form} #${e.create} {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

#${e.create} span {
  font-size: 12px;
  padding: 0px 0px 3px 0px;
}

#${e.createIcon} {
  width: 54px;
  height: ${w.buttonText === "none" ? "54px" : "34px"};
}

#${e.createIcon}.andrew {
  width: 44px;
  height: 44px;
  padding-top: 8px;
  padding-left: 3px;
}

#${e.createIcon}.andrew path {
  stroke-width: 0;
}

#${e.createIcon}.andrew .andrew-darker {
  filter: brightness(55%);
}

#${e.createIcon}.mo path {
  stroke: var(--huckleberry-ping-accent-contrast-color);
  stroke-width: 10;
}


#${e.createIcon} circle,
#${e.createIcon} rect {
  fill: var(--huckleberry-ping-accent-contrast-color);
}

#${e.createIcon} #phone-outline {
  fill: none;
  stroke-width: 10;
  stroke: var(--huckleberry-ping-accent-contrast-color);
}


#${e.loader},
#${e.success},
#${e.error} {
  border-radius: 8px;
  width: 54px;
  height: 54px;
}

#${e.success} rect { 
  fill: var(--huckleberry-ping-success-color);
}

#${e.success} polyline {
  fill: none;
  stroke: white;
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke-width: 6;
  stroke-dasharray: 1000;
  stroke-dashoffset: -100;
}

#${e.success}.shown polyline {
  -webkit-animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation-delay: 0.4s;
}

#${e.error} rect { 
  fill: var(--huckleberry-ping-fail-color);
}

#${e.error} line {
  fill: none;
  stroke: white;
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke-width: 6;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
}

#${e.error}.shown line {
  -webkit-animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation-delay: 0.4s;
}

#${e.loader} {
  font-size: 3.4rem;
  width: 1em;
  height: 1em;
}

#${e.loader}.shown {
  animation: 2s rotate infinite linear;
}

#${e.loader} circle {
  fill: transparent;
  stroke: var(--huckleberry-ping-success-color);
  stroke-width: 0.128em;
  stroke-linecap: round;
  stroke-dasharray: 1.5056em 0.30112em;
  animation: 1.5s strokeDashArray infinite linear,
    24s colorBounce infinite linear;
}

@-webkit-keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}
@keyframes dash-check {
  0% {
    stroke-dashoffset: -100;
  }
  100% {
    stroke-dashoffset: 900;
  }
}

@-webkit-keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}
@keyframes dash {
  0% {
    stroke-dashoffset: 1000;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

@keyframes strokeDashArray {
  from {
    stroke-dasharray: 1.5056em 0.30112em;
    stroke-dashoffset: 0;
  }

  10% {
    stroke-dasharray: 1.5056em 0.30112em;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 0.001em 1.695em;
    stroke-dashoffset: -1.695em;
  }

  60% {
    stroke-dasharray: 0.001em 1.695em;
  }

  to {
    stroke-dasharray: 1.5056em 0.30112em;
    stroke-dashoffset: -1.695em;
  }
}
`;
