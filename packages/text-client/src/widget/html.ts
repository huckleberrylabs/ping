export const HTML = `<div id="huckleberry-text-container">
      <form id="huckleberry-text-form">
        <input
          id="huckleberry-text-app-id-input"
          type="hidden"
          name="app_id"
        />

        <!-- Stage 1 -->
        <button id="huckleberry-text-open-button" class="shown" type="button">
          SMS
        </button>

        <!-- Stage 2 -->
        <input
          id="huckleberry-text-message-input"
          type="text"
          name="message"
          placeholder="Message"
        />
        <button id="huckleberry-text-message-button" type="button">Next</button>

        <!-- Stage 3 -->
        <input
          id="huckleberry-text-phone-input"
          type="text"
          name="phone"
          placeholder="Your Phone #"
        />
        <button id="huckleberry-text-phone-button" type="button">Next</button>

        <!-- Stage 4 -->
        <input
          id="huckleberry-text-name-input"
          type="text"
          name="name"
          placeholder="What do we call you?"
        />
        <button id="huckleberry-text-send-button" type="button">Send</button>

        <!-- Messages -->
        <div id="huckleberry-text-invalid-message">Input Invalid</div>
        <div id="huckleberry-text-success-message">Message Sent</div>
        <div id="huckleberry-text-error-message">Please Try Again Later</div>
      </form>
    </div>`;
