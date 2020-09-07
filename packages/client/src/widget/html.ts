import { Config, Widget, Color } from "@huckleberrylabs/ping-core";
import { ElementIDs } from "./elements";

export const InsertHTML = (html: string) => {
  const div = document.createElement("div").attachShadow({ mode: "open" });
  div.innerHTML = html;
  document.getElementsByTagName("body")[0].appendChild(div);
  return div;
};

export const AndrewIcon = (id: string, color: Color.T) =>
  `<svg id="${id}" class="andrew" width="630" height="630" viewBox="0 0 630 630" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" stroke="none" d="M249 510C380.996 510 488 414.637 488 297C488 179.363 380.996 84 249 84C117.004 84 10 179.363 10 297C10 382.768 66.881 456.696 148.858 490.457L189.292 462.454C191.066 460.929 193.419 460 196 460C201.523 460 206 464.253 206 469.5C206 473.062 203.937 476.165 200.884 477.792L172.304 498.796C196.378 506.061 222.173 510 249 510ZM131 287V287.047C125.947 287.524 122 291.574 122 296.5C122 301.426 125.947 305.476 131 305.953V306H376V305.565C380.057 304.355 383 300.754 383 296.5C383 292.246 380.057 288.645 376 287.435V287H131ZM131 354V354.435C126.943 355.646 124 359.246 124 363.5C124 367.754 126.943 371.354 131 372.565V373H376V372.565C380.057 371.354 383 367.754 383 363.5C383 359.246 380.057 355.646 376 354.435V354H131ZM185 220C179.477 220 175 224.253 175 229.5C175 234.747 179.477 239 185 239H323V238.81C327.564 237.93 331 234.096 331 229.5C331 224.904 327.564 221.07 323 220.19V220H185Z" fill="${color}"/>
    <path d="M49.2529 414L148.858 490.457L118 506L84.0001 518.5L47.5001 528.5L10.5001 535.5C10.5001 535.5 22.0745 520.668 27.5001 510C33.24 498.714 34.9877 491.665 38.5001 479.5C42.0486 467.21 43.3497 460.11 45.5001 447.5C47.6504 434.89 49.2529 414 49.2529 414Z" fill="${color}"/>
    <path class="andrew-darker" fill-rule="evenodd" clip-rule="evenodd" d="M444.921 419.807C472.07 385.167 488 342.995 488 297.5C488 179.587 380.996 84 249 84C194.144 84 143.605 100.509 103.268 128.269C140.513 52.7371 225.106 0 323.5 0C456.325 0 564 96.1026 564 214.651C564 258.283 549.414 298.875 524.357 332.753C524.777 337.524 526.415 355.383 528.277 366.318C530.441 379.026 531.75 386.18 535.321 398.566C535.663 399.752 535.989 400.891 536.303 401.989L536.308 402.009C539.236 412.249 541.177 419.036 546.39 429.302C551.85 440.053 563.497 455 563.497 455L526.265 447.946L489.536 437.868L455.322 425.271L444.921 419.807Z" fill="${color}"/>
  </svg>
  `;

export const MoIcon = (id: string) =>
  `<svg id="${id}" class="mo" width="630" height="630" viewBox="0 0 630 430" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect id="phone-outline" x="221.199" y="81" width="185.106" height="299.875" rx="5"/>
      <rect x="282.191" y="339.968" width="63.1227" height="5.73843" rx="2.86921"/>
      <circle cx="312.318" cy="123.342" r="10.0422"/>
      <path d="M451.475 205.115C469.83 218.887 471.36 259.056 451.475 273.976"/>
      <path d="M477.297 147.73C525.022 183.882 528.999 289.326 477.297 328.491"/>
      <path d="M176.03 271.106C157.675 257.334 156.145 217.165 176.03 202.245"/>
      <path d="M150.207 328.491C102.483 292.339 98.5056 186.895 150.207 147.73"/>
  </svg>
  `;

export const GenerateHTML = (e: ElementIDs) => (w: Widget.Settings.Model.T) => (
  css: string
) =>
  `<div id="${e.container}">
      <style type="text/css">${css}</style>
      <!--
          ${Config.SecretDeveloperMessage}
      -->
      <form id="${e.form}">
        <button id="${e.cancel}" type="button">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 20 20">
          <g>
            <line x1="6" x2="14" y1="6" y2="14"/>
            <line x1="14" x2="6" y1="6" y2="14"/>
          </g>
        </svg>
        </button>
        <!-- Stage 1 -->
        <button id="${e.create}" class="shown" type="button">
          ${
            w.icon === 1
              ? MoIcon(e.createIcon)
              : AndrewIcon(e.createIcon, w.color)
          }
          ${w.buttonText !== "none" ? `<span>${w.buttonText}</span>` : ""}
        </button>

        <!-- Stage 2 -->
        <input
          id="${e.textInput}"
          type="text"
          name="message"
          placeholder="Your Message"
        />
        <button id="${e.addText}" type="button">Next</button>

        <!-- Stage 3 -->
        <input
          id="${e.phoneInput}"
          type="text"
          name="phone"
          placeholder="Your Phone #"
        />
        <button id="${e.addPhone}" type="button">Next</button>

        <!-- Stage 4 -->
        <input
          id="${e.nameInput}"
          type="text"
          name="name"
          placeholder="Your Name"
        />
        <button id="${e.send}" type="button">Send</button>

        <!-- Messages -->
        <svg id="${
          e.loader
        }" xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
          <g>
            <circle cx="32" cy="32" r="22.4"/>
          </g>
        </svg>

        <svg id="${
          e.success
        }" xmlns="http://www.w3.org/2000/svg" width="176" height="176" viewBox="0 0 176 176">
          <g>
            <rect width="178" height="178" x="-1" y="-1"/>
            <polyline points="123.19999694824219,63.69999694824219 74.5,112.30000305175781 52.80000305175781,91"/>
          </g>
        </svg>
        <svg id="${
          e.error
        }" xmlns="http://www.w3.org/2000/svg" width="176" height="176" viewBox="0 0 176 176">
          <g>
            <rect width="178" height="178" x="-1" y="-1"/>
            <line x1="50.300004" x2="125.700001" y1="51.799996" y2="124.199999"/>
            <line x1="125.700001" x2="50.300004" y1="51.933084" y2="124.06691"/>
          </g>
        </svg>

      </form>
    </div>`;
