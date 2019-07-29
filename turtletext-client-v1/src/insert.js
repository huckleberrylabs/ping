(function() {
  const TURTLE_TEXT_API_URL = "/turtletext/api/";

  const TURTLE_TEXT_HTML = `<div id="turtle-text-container">
      <form id="turtle-text-form">
        <input
          id="turtle-text-app-id-input"
          type="hidden"
          name="app_id"
        />

        <!-- Stage 1 -->
        <button id="turtle-text-open-button" class="shown" type="button">
          <img id="turtle-text-logo" src="icons/smartphone-message.svg">
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
          <img id="turtle-text-loader-message" src="icons/loader-circle.svg" alt="loader">
        </div>
        <!-- Messages -->
        <img id="turtle-text-invalid-message" src="icons/invalid.svg" alt="invalid">
        <div id="turtle-text-successID"></div>
        <div id="turtle-text-errorID"></div>
        
      </form>
    </div>`;

  const CHECK_MARK_HTML = `<img id="turtle-text-success-message" src="icons/check-mark.svg" alt="success">`;
  const X_MARK_HTML = `<img id="turtle-text-error-message" src="icons/x-mark.svg" alt="error">`;

  function injectCSS(appID, onLoad) {
    console.log("Turtle Text CSS Injected");
    var cssID = "turtle-text-css";
    if (!document.getElementById(cssID)) {
      var head = document.getElementsByTagName("head")[0];
      var link = document.createElement("link");
      link.id = cssID;
      link.rel = "stylesheet";
      link.type = "text/css";
      link.href = "stylesheet.css";
      link.media = "all";
      link.onload = onLoad;
      head.appendChild(link);
    }
  }
  function injectHTML(onLoad) {
    console.log("Turtle Text HTML Injected");
    document.body.innerHTML = document.body.innerHTML + TURTLE_TEXT_HTML;
    setTimeout(onLoad, 300);
  }

  function getAppID() {
    console.log("Turtle Text App ID Retrieved");
    var script = document.getElementById("turtle-text-insert-script");
    return script.getAttribute("data-app-id");
  }

  function setAppIDInputValue(appID) {
    console.log("Turtle Text App ID Input Value Set");
    var appIDInput = document.getElementById("turtle-text-app-id-input");
    appIDInput.value = appID;
  }

  function setMessageInputValue(message) {
    console.log("Turtle Text Message Input Value Set");
    var messageInput = document.getElementById("turtle-text-message-input");
    messageInput.value = message;
  }

  function getAppConfig(appID) {
    console.log("Turtle Text Getting App Config");
    var req = new XMLHttpRequest();
    req.open("GET", TURTLE_TEXT_API_URL + "config.ts?app_id=" + appID, true);
    req.send();
    req.onload = function onTurtleTextAppConfig() {
      console.log("Turtle Text App Config Loaded");
      var data = JSON.parse(req.responseText);
      setMessageInputValue(data.defaultMessage);
    };
  }

  function normalizePhone(phone) {
    if (phone) {
      return phone.match(/\d/g).join("");
    }
  }

  function validatePhone(phone) {
    if (phone) {
      return normalizePhone(phone).length === 10;
    }
    return false;
  }

  function validateString(string) {
    if (string) {
      return typeof string === "string" && string.trim().length > 0;
    }
    return false;
  }

  function setEventHandlers() {
    console.log("Turtle Text Event Handlers Set");
    var container = document.getElementById("turtle-text-container");
    var form = document.getElementById("turtle-text-form");

    var openButton = document.getElementById("turtle-text-open-button");

    var messageInput = document.getElementById("turtle-text-message-input");
    var messageButton = document.getElementById("turtle-text-message-button");

    var phoneInput = document.getElementById("turtle-text-phone-input");
    var phoneButton = document.getElementById("turtle-text-phone-button");

    var nameInput = document.getElementById("turtle-text-name-input");
    var sendButton = document.getElementById("turtle-text-send-button");

    var loaderMessage = document.getElementById("turtle-text-loader-message");

    var invalidMessage = document.getElementById("turtle-text-invalid-message");
    var successMessage = document.getElementById("turtle-text-success-message");
    var errorMessage = document.getElementById("turtle-text-error-message");

    function showInvalidMessage(message) {
      invalidMessage.innerHTML = message;
      invalidMessage.classList.add("shown");
      setTimeout(() => {
        invalidMessage.classList.remove("shown");
      }, 500);
    }

    function onTurtleTextOpenedEvent() {
      console.log("Turtle Text Opened");
      container.style.width = "37rem";
      openButton.classList.remove("shown");
      messageButton.classList.add("shown");
      messageInput.classList.add("shown");
      messageInput.focus();
    }

    function onTurtleTextMessageAddedEvent() {
      console.log("Turtle Text Message Added");
      var message = messageInput.value;
      if (validateString(message)) {
        container.style.width = "23rem";
        invalidMessage.classList.remove("shown");
        messageButton.classList.remove("shown");
        messageInput.classList.remove("shown");
        phoneInput.classList.add("shown");
        phoneButton.classList.add("shown");
        phoneInput.focus();
      } else {
        showInvalidMessage("Message Required");
      }
    }

    function onTurtleTextPhoneAddedEvent() {
      console.log("Turtle Text Phone Added");
      var phone = phoneInput.value;
      if (validatePhone(phone)) {
        container.style.width = "27rem";
        invalidMessage.classList.remove("shown");
        phoneButton.classList.remove("shown");
        phoneInput.classList.remove("shown");
        nameInput.classList.add("shown");
        sendButton.classList.add("shown");
        nameInput.focus();
      } else {
        showInvalidMessage("Valid Phone # Required");
      }
    }

    function onTurtleTextNameAddedAndSentEvent() {
      console.log("Turtle Text Name Added and Sent");
      var name = nameInput.value;
      if (validateString(name)) {
        var submitDelay = 1500;
        nameInput.style.transition = "all .4s ease";
        sendButton.style.transition = "all .4s ease";
        invalidMessage.classList.remove("shown");
        nameInput.classList.remove("shown");
        sendButton.classList.remove("shown");
        loaderMessage.classList.add("shown");
        container.style.transition =
          "all .4s cubic-bezier(0.47, 0.47, 0.27, 1.20) .4s";
        container.style.width = "";
        var data = {
          appID: getAppID(),
          message: messageInput.value.trim(),
          phone: normalizePhone(phoneInput.value),
          name: nameInput.value.trim()
        };
        var req = new XMLHttpRequest();
        req.open("POST", TURTLE_TEXT_API_URL + "send.ts", true);
        req.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

        // fake code starts (simulate sending message)

        // setTimeout(() => {
        //   document.getElementById(
        //     "turtle-text-errorID"
        //   ).innerHTML = X_MARK_HTML;
        //   errorMessage = document.getElementById("turtle-text-error-message");
        //   setTimeout(() => {
        //     loaderMessage.classList.remove("shown");
        //     errorMessage.classList.add("shownMessage");
        //   }, 100);
        // }, 3000);

        // fake code ends

        req.send(JSON.stringify(data));
        req.onload = function onLoad() {
          console.log("Turtle Text Sent");
          if (req.status >= 200 && req.status < 300) {
            document.getElementById(
              "turtle-text-successID"
            ).innerHTML = CHECK_MARK_HTML;
            successMessage = document.getElementById(
              "turtle-text-success-message"
            );
            setTimeout(() => {
              loaderMessage.classList.remove("shown");
              successMessage.classList.add("shownMessage");
            }, 100);
          } else {
            document.getElementById(
              "turtle-text-errorID"
            ).innerHTML = X_MARK_HTML;
            errorMessage = document.getElementById("turtle-text-error-message");
            setTimeout(() => {
              loaderMessage.classList.remove("shown");
              errorMessage.classList.add("shownMessage");
            }, 100);
          }
        };
      } else {
        showInvalidMessage("Name Required");
      }
    }

    openButton.addEventListener("click", onTurtleTextOpenedEvent);
    messageButton.addEventListener("click", onTurtleTextMessageAddedEvent);
    phoneButton.addEventListener("click", onTurtleTextPhoneAddedEvent);
    sendButton.addEventListener("click", onTurtleTextNameAddedAndSentEvent);
  }

  function onTurtleTextWindowLoaded() {
    console.log("Turtle Text Window Loaded");
    const appID = getAppID();
    injectCSS(appID, onTurtleTextCSSLoaded);
  }
  function onTurtleTextCSSLoaded() {
    console.log("Turtle Text CSS Loaded");
    injectHTML(onTurtleTextHTMLLoaded);
  }
  function onTurtleTextHTMLLoaded() {
    const appID = getAppID();
    setEventHandlers();
    setAppIDInputValue(appID);
    getAppConfig(appID);
  }

  if (window.attachEvent) {
    window.attachEvent("onload", onTurtleTextWindowLoaded);
  } else {
    window.addEventListener("load", onTurtleTextWindowLoaded, false);
  }
})();
