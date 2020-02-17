import { Config, Widget } from "@huckleberryai/ping";
import { Color } from "@huckleberryai/core";
import { ElementIDs } from "./elements";

export const InsertHTML = (html: string) => {
  const div = document.createElement("div");
  div.innerHTML = html;
  document.getElementsByTagName("body")[0].appendChild(div);
};

export const AndrewIcon = (id: string, color: Color.T) =>
  `<svg id="${id}" class="andrew" width="630" height="630" viewBox="0 0 630 630" fill="none" xmlns="http://www.w3.org/2000/svg">s
    <path fill-rule="evenodd" clip-rule="evenodd" stroke="none" d="M249 510C380.996 510 488 414.637 488 297C488 179.363 380.996 84 249 84C117.004 84 10 179.363 10 297C10 382.768 66.881 456.696 148.858 490.457L189.292 462.454C191.066 460.929 193.419 460 196 460C201.523 460 206 464.253 206 469.5C206 473.062 203.937 476.165 200.884 477.792L172.304 498.796C196.378 506.061 222.173 510 249 510ZM131 287V287.047C125.947 287.524 122 291.574 122 296.5C122 301.426 125.947 305.476 131 305.953V306H376V305.565C380.057 304.355 383 300.754 383 296.5C383 292.246 380.057 288.645 376 287.435V287H131ZM131 354V354.435C126.943 355.646 124 359.246 124 363.5C124 367.754 126.943 371.354 131 372.565V373H376V372.565C380.057 371.354 383 367.754 383 363.5C383 359.246 380.057 355.646 376 354.435V354H131ZM185 220C179.477 220 175 224.253 175 229.5C175 234.747 179.477 239 185 239H323V238.81C327.564 237.93 331 234.096 331 229.5C331 224.904 327.564 221.07 323 220.19V220H185Z" fill="${color}"/>
    <path d="M49.2529 414L148.858 490.457L118 506L84.0001 518.5L47.5001 528.5L10.5001 535.5C10.5001 535.5 22.0745 520.668 27.5001 510C33.24 498.714 34.9877 491.665 38.5001 479.5C42.0486 467.21 43.3497 460.11 45.5001 447.5C47.6504 434.89 49.2529 414 49.2529 414Z" fill="${color}"/>
    <path class="andrew-darker" fill-rule="evenodd" clip-rule="evenodd" d="M444.921 419.807C472.07 385.167 488 342.995 488 297.5C488 179.587 380.996 84 249 84C194.144 84 143.605 100.509 103.268 128.269C140.513 52.7371 225.106 0 323.5 0C456.325 0 564 96.1026 564 214.651C564 258.283 549.414 298.875 524.357 332.753C524.777 337.524 526.415 355.383 528.277 366.318C530.441 379.026 531.75 386.18 535.321 398.566C535.663 399.752 535.989 400.891 536.303 401.989L536.308 402.009C539.236 412.249 541.177 419.036 546.39 429.302C551.85 440.053 563.497 455 563.497 455L526.265 447.946L489.536 437.868L455.322 425.271L444.921 419.807Z" fill="${color}"/>
  </svg>
  `;

export const MoIcon = (id: string) =>
  `<svg id="${id}" class="mo" width="630" height="630" viewBox="0 0 630 630" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path id="ping-text" d="M196.11 556.36V521.08C199.71 526.408 207.342 530.728 217.422 530.728C237.582 530.728 250.398 514.888 250.398 493.864C250.398 473.128 238.734 457.288 217.998 457.288C207.198 457.288 199.134 462.328 195.678 468.376V458.872H179.55V556.36H196.11ZM233.694 493.864C233.694 507.256 225.918 515.896 214.83 515.896C203.886 515.896 195.966 507.256 195.966 493.864C195.966 480.76 203.886 472.12 214.83 472.12C226.062 472.12 233.694 480.76 233.694 493.864ZM283.016 529V458.872H266.456V529H283.016ZM263.864 434.248C263.864 440.296 268.76 445.048 274.664 445.048C280.712 445.048 285.608 440.296 285.608 434.248C285.608 428.2 280.712 423.304 274.664 423.304C268.76 423.304 263.864 428.2 263.864 434.248ZM321.27 488.536C321.27 479.32 326.31 471.976 335.814 471.976C346.326 471.976 350.214 478.888 350.214 487.528V529H366.918V484.648C366.918 469.24 358.71 456.856 341.574 456.856C333.798 456.856 325.446 460.168 320.838 468.232V458.872H304.566V529H321.27V488.536ZM382.213 532.888C384.085 547 397.045 558.52 415.621 558.52C441.973 558.52 451.621 541.096 451.621 522.376V458.872H435.493V467.8C432.469 462.04 425.701 457.576 414.757 457.576C395.461 457.576 382.357 472.984 382.357 491.704C382.357 511.432 396.037 525.832 414.757 525.832C424.981 525.832 432.037 521.08 435.061 515.608V522.952C435.061 537.208 428.437 543.976 415.189 543.976C405.541 543.976 398.773 537.496 397.621 528.856L382.213 532.888ZM417.493 511.576C406.549 511.576 399.205 503.944 399.205 491.704C399.205 479.752 406.837 471.976 417.493 471.976C427.861 471.976 435.493 479.752 435.493 491.704C435.493 503.8 428.149 511.576 417.493 511.576Z"/>
      <rect id="phone-outline" x="221.199" y="81" width="185.106" height="299.875" rx="5"/>
      <rect x="282.191" y="339.968" width="63.1227" height="5.73843" rx="2.86921"/>
      <circle cx="312.318" cy="123.342" r="10.0422"/>
      <path d="M451.475 205.115C469.83 218.887 471.36 259.056 451.475 273.976"/>
      <path d="M477.297 147.73C525.022 183.882 528.999 289.326 477.297 328.491"/>
      <path d="M176.03 271.106C157.675 257.334 156.145 217.165 176.03 202.245"/>
      <path d="M150.207 328.491C102.483 292.339 98.5056 186.895 150.207 147.73"/>
  </svg>
  `;

export const GenerateHTML = (e: ElementIDs) => (w: Widget.T) =>
  `<div id="${e.container}">
      <!--
          ${Config.SecretDeveloperMessage}
      -->
      <form id="${e.form}">
        <!-- Stage 1 -->
        <button id="${e.create}" class="shown ${
    w.icon === 2 ? "andrew" : ""
  }" type="button">
          ${
            w.icon === 1
              ? MoIcon(e.createIcon)
              : AndrewIcon(e.createIcon, w.color)
          }
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
