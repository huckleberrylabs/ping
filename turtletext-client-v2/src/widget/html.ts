export const HTML = `<div id="turtle-text-container">
      <form id="turtle-text-form">
        <input
          id="turtle-text-app-id-input"
          type="hidden"
          name="app_id"
        />

        <!-- Stage 1 -->
        <button id="turtle-text-open-button" class="shown" type="button">
          <img id="turtle-text-logo" src="./icons/smartphone-message.svg">
        </button>

        <!-- Stage 2 -->
        <input
          id="turtle-text-message-input"
          type="text"
          name="message"
          placeholder="Message"
        />
        <button id="turtle-text-message-button" type="button">Next</button>

        <!-- Stage 3 -->
        <input
          id="turtle-text-phone-input"
          type="text"
          name="phone"
          placeholder="Your Phone #"
        />
        <button id="turtle-text-phone-button" type="button">Next</button>

        <!-- Stage 4 -->
        <input
          id="turtle-text-name-input"
          type="text"
          name="name"
          placeholder="What do we call you?"
        />
        <button id="turtle-text-send-button" type="button">Send</button>

        <!-- Loading -->
        <div>
          <object id="turtle-text-loader-message" data="icons/loader-circle.svg" alt="loader">
          </object>
        </div>

        <!-- Messages -->
        <img id="turtle-text-invalid-message" src="./icons/invalid.svg" alt="invalid">
        <div id="turtle-text-success-message-mount"></div>
        <div id="turtle-text-error-message-mount"></div>
      </form>
    </div>`;
