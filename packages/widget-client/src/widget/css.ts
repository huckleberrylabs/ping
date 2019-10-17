import { UUID } from "@huckleberryai/core";
import { Settings } from "@huckleberryai/widget";
import { ElementIDs } from "./elements";

export const InsertCSS = (css: string) => {
  const style = document.createElement("style");
  style.id = `css-${UUID.C()}`;
  style.type = "text/css";
  style.innerHTML = css;
  const head = document.getElementsByTagName("head")[0];
  head.appendChild(style);
};

export const GenerateCSS = (e: ElementIDs) => (w: Settings.T) =>
  `:root {
  --huckleberry-text-accent-color: ${w.color};
  --huckleberry-text-main-color:  white;
  --huckleberry-text-success-color: #00ae4e;
  --huckleberry-text-fail-color: #ae0034;
}
#${e.container} * {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}
#${e.container} {
  position: fixed;
  z-index: 2147483647;
  bottom: 24px;
  right: 24px;
  width: 64px;
  max-width: 90vw;
  height: 64px;
  border-radius: 5px;
  overflow: hidden;
  transition: width 0.5s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  background-color: var(--huckleberry-text-main-color);
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
  background-color: var(--huckleberry-text-accent-color);
  color: var(--huckleberry-text-main-color);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}
#${e.form} input {
  width: 100%;
  background-color: var(--huckleberry-text-main-color);
  box-sizing: border-box;
  padding: 0 20px;
}

#${e.form} input:invalid {
  background-color: #FDD;
}

#${e.container} > #${e.form} .shown {
  transition: all 0.4s ease 0.4s;
  transform: scale(1);
  opacity: 1;
}

#${e.container} > #${e.form} #${e.loader}.shown,
#${e.container} > #${e.form} #${e.success}.shown,
#${e.container} > #${e.form} #${e.error}.shown {
  transition: opacity 0.4s ease 0.4s;
  transform: scale(1);
  opacity: 1;
}

#${e.form} #${e.create} {
  width: 100%;
}

#${e.createIcon},
#${e.loader},
#${e.success},
#${e.error} {
  width: 64px;
  height: 64px;
}

#${e.createIcon} path {
  fill: var(--huckleberry-text-main-color);
}

#${e.success} rect { 
  fill: var(--huckleberry-text-success-color);
}

#${e.success} polyline {
  fill: none;
  stroke: var(--huckleberry-text-main-color);
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke-width: 6;
  stroke-dasharray: 1000;
  stroke-dashoffset: -100;
}

#${e.container} > #${e.form} #${e.success}.shown polyline {
  -webkit-animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation-delay: 0.4s;
}

#${e.error} rect { 
  fill: var(--huckleberry-text-fail-color);
}

#${e.error} line {
  fill: none;
  stroke: var(--huckleberry-text-main-color);
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke-width: 6;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;
}

#${e.container} > #${e.form} #${e.error}.shown line {
  -webkit-animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation-delay: 0.4s;
}

#${e.loader} {
  font-size: 4rem;
  width: 1em;
  height: 1em;
}

#${e.container} > #${e.form} #${e.loader}.shown {
  animation: 2s rotate infinite linear;
}

#${e.loader} circle {
  fill: transparent;
  stroke: var(--huckleberry-text-accent-color);
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
