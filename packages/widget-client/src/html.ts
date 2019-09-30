import {
  CONTAINER_ID,
  FORM_ID,
  OPEN_BUTON_ID,
  OPEN_BUTON_ICON_ID,
  MESSAGE_INPUT_ID,
  MESSAGE_BUTTON_ID,
  PHONE_INPUT_ID,
  PHONE_BUTTON_ID,
  NAME_INPUT_ID,
  SEND_BUTTON_ID,
  SUCCESS_ID,
  ERROR_ID,
  LOADER_ID,
} from "./element-ids";

/** will not throw an error */
export function generateHTML() {
  return `<div id="${CONTAINER_ID}">
      <form id="${FORM_ID}">

        <!-- Stage 1 -->
        <button id="${OPEN_BUTON_ID}" class="shown" type="button">
          <svg  id="${OPEN_BUTON_ICON_ID}" xmlns="http://www.w3.org/2000/svg" width="114.751" height="114.751"  viewBox="0 0 114.751 114.751">
            <g>
              <path d="m86.8095,37.576l-8.659,0l0,-15.554c0,-3.039 -2.484,-5.522 -5.521,-5.522l-36.447,0c-3.039,0 -5.521,2.483 -5.521,5.522l0,70.707c0,3.038 2.483,5.522 5.521,5.522l36.447,0c3.036,0 5.521,-2.484 5.521,-5.522l0,-17.754l8.659,0c2.912,0 5.28,-2.352 5.28,-5.244l0,-26.911c0,-2.889 -2.368,-5.244 -5.28,-5.244zm-38.235,-17.096l11.661,0c0.368,0 0.67,0.299 0.67,0.668c0,0.366 -0.302,0.667 -0.67,0.667l-11.661,0c-0.369,0 -0.667,-0.301 -0.667,-0.667c0,-0.369 0.298,-0.668 0.667,-0.668zm5.83,75.014c-1.522,0 -2.761,-1.236 -2.761,-2.765c0,-1.524 1.236,-2.761 2.761,-2.761s2.764,1.236 2.764,2.761c-0.001,1.528 -1.239,2.765 -2.764,2.765zm19.902,-7.459l-39.806,0l0,-62.778l39.806,0l0,12.319l-22.755,0c-2.909,0 -5.276,2.355 -5.276,5.247l0,26.911c0,2.891 2.367,5.244 5.276,5.244l3.189,0l0,9.015l9.016,-9.015l10.55,0l0,13.057zm15.447,-18.302c0,1.604 -1.318,2.908 -2.944,2.908l-24.018,0l-5.713,5.712l0,-5.712l-5.527,0c-1.621,0 -2.94,-1.305 -2.94,-2.908l0,-26.911c0,-1.605 1.317,-2.911 2.94,-2.911l35.258,0c1.621,0 2.944,1.306 2.944,2.911l0,26.911zm-5.841,-21.483c0,0.799 -0.606,1.444 -1.353,1.444l-26.686,0c-0.745,0 -1.353,-0.645 -1.353,-1.444c0,-0.794 0.608,-1.443 1.353,-1.443l26.686,0c0.746,0 1.353,0.649 1.353,1.443zm0,7.83c0,0.8 -0.606,1.447 -1.353,1.447l-26.686,0c-0.745,0 -1.353,-0.647 -1.353,-1.447c0,-0.793 0.608,-1.44 1.353,-1.44l26.686,0c0.746,-0.001 1.353,0.646 1.353,1.44zm0,7.83c0,0.798 -0.606,1.446 -1.353,1.446l-26.686,0c-0.745,0 -1.353,-0.648 -1.353,-1.446c0,-0.796 0.608,-1.441 1.353,-1.441l26.686,0c0.746,-0.001 1.353,0.647 1.353,1.441z"/>
            </g>
          </svg>
        </button>

        <!-- Stage 2 -->
        <input
          id="${MESSAGE_INPUT_ID}"
          type="text"
          name="message"
          placeholder="Your Message"
        />
        <button id="${MESSAGE_BUTTON_ID}" type="button">Next</button>

        <!-- Stage 3 -->
        <input
          id="${PHONE_INPUT_ID}"
          type="text"
          name="phone"
          placeholder="Your Phone #"
        />
        <button id="${PHONE_BUTTON_ID}" type="button">Next</button>

        <!-- Stage 4 -->
        <input
          id="${NAME_INPUT_ID}"
          type="text"
          name="name"
          placeholder="Your Name"
        />
        <button id="${SEND_BUTTON_ID}" type="button">Send</button>

        <!-- Messages -->
        <svg id="${LOADER_ID}" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
          <g>
            <circle cx="32" cy="32" r="22.4"/>
          </g>
        </svg>

        <svg id="${SUCCESS_ID}" xmlns="http://www.w3.org/2000/svg" width="176" height="176" viewBox="0 0 176 176">
          <g>
            <rect width="178" height="178" x="-1" y="-1"/>
            <polyline points="123.19999694824219,63.69999694824219 74.5,112.30000305175781 52.80000305175781,91"/>
          </g>
        </svg>
        <svg id="${ERROR_ID}" xmlns="http://www.w3.org/2000/svg" width="176" height="176" viewBox="0 0 176 176">
          <g>
            <rect width="178" height="178" x="-1" y="-1"/>
            <line x1="50.300004" x2="125.700001" y1="51.799996" y2="124.199999"/>
            <line x1="125.700001" x2="50.300004" y1="51.933084" y2="124.06691"/>
          </g>
        </svg>

      </form>
    </div>`;
}
