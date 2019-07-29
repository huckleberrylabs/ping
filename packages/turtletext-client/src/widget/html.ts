export const HTML = `<div id="turtle-text-container">
      <form id="turtle-text-form">
        <input
          id="turtle-text-app-id-input"
          type="hidden"
          name="app_id"
        />

        <!-- Stage 1 -->
        <button id="turtle-text-open-button" class="shown" type="button">
          SMS
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

        <!-- Messages -->
        <div id="turtle-text-invalid-message">Input Invalid</div>
        <div id="turtle-text-success-message">Message Sent</div>
        <div id="turtle-text-error-message">Please Try Again Later</div>
      </form>
    </div>`;
