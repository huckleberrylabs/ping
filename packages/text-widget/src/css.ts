import {
  CONTAINER_ID,
  FORM_ID,
  OPEN_BUTON_ID,
  OPEN_BUTON_ICON_ID,
  LOADER_ID,
  SUCCESS_ID,
  ERROR_ID,
} from "./element-ids";

export function generateCSS(mainColor: string, accentColor: string) {
  return `:root {
  --huckleberry-text-main-color: ${mainColor};
  --huckleberry-text-accent-color: ${accentColor};
  --huckleberry-text-success-color: #00ae4e;
  --huckleberry-text-fail-color: #ae0034;
}
#${CONTAINER_ID} * {
  font-size: 14px;
  font-family: Arial, Helvetica, sans-serif;
}
#${CONTAINER_ID} {
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
#${FORM_ID} {
  width: 100%;
  height: 100%;
}
#${FORM_ID} button,
#${FORM_ID} input,
#${LOADER_ID},
#${SUCCESS_ID},
#${ERROR_ID} {
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
#${FORM_ID} button {
  width: 20%;
  padding: 0;
  border-radius: 5px;
  cursor: pointer;
  background-color: var(--huckleberry-text-accent-color);
  color: var(--huckleberry-text-main-color);
  box-shadow: 0 2px 2px rgba(0, 0, 0, 0.3);
}
#${FORM_ID} input {
  width: 100%;
  background-color: var(--huckleberry-text-main-color);
  box-sizing: border-box;
  padding: 0 20px;
}

#${FORM_ID} input:invalid {
  background-color: #FDD;
}

#${CONTAINER_ID} > #${FORM_ID} .shown {
  transition: all 0.4s ease 0.4s;
  transform: scale(1);
  opacity: 1;
}

#${CONTAINER_ID} > #${FORM_ID} #${LOADER_ID}.shown,
#${CONTAINER_ID} > #${FORM_ID} #${SUCCESS_ID}.shown,
#${CONTAINER_ID} > #${FORM_ID} #${ERROR_ID}.shown {
  transition: opacity 0.4s ease 0.4s;
  transform: scale(1);
  opacity: 1;
}

#${FORM_ID} #${OPEN_BUTON_ID} {
  width: 100%;
}

#${OPEN_BUTON_ICON_ID},
#${LOADER_ID},
#${SUCCESS_ID},
#${ERROR_ID} {
  width: 64px;
  height: 64px;
}

#${OPEN_BUTON_ICON_ID} path {
  fill: var(--huckleberry-text-main-color);
}

#${SUCCESS_ID} rect { 
  fill: var(--huckleberry-text-success-color);
}

#${SUCCESS_ID} polyline {
  fill: none;
  stroke: var(--huckleberry-text-main-color);
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke-width: 6;
  stroke-dasharray: 1000;
  stroke-dashoffset: -100;
}

#${CONTAINER_ID} > #${FORM_ID} #${SUCCESS_ID}.shown polyline {
  -webkit-animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation-delay: 0.4s;
}

#${ERROR_ID} rect { 
  fill: var(--huckleberry-text-fail-color);
}

#${ERROR_ID} line {
  fill: none;
  stroke: var(--huckleberry-text-main-color);
  stroke-linecap: round;
  stroke-miterlimit: 10;
  stroke-width: 6;
  stroke-dasharray: 1000;
  stroke-dashoffset: 1000;s
}

#${CONTAINER_ID} > #${FORM_ID} #${ERROR_ID}.shown line {
  -webkit-animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation: dash-check 0.9s 0.45s ease-in-out forwards;
  animation-delay: 0.4s;
}

#${LOADER_ID} {
  font-size: 4rem;
  width: 1em;
  height: 1em;
}

#${CONTAINER_ID} > #${FORM_ID} #${LOADER_ID}.shown {
  animation: 2s rotate infinite linear;
}

#${LOADER_ID} circle {
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
}
