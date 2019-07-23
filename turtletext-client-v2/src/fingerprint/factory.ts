import { SOCIAL_MEDIA_PLATFORMS } from "./social";
import { FONTS } from "./fonts";
import { SocialMap, FingerPrint, FontMap, GPU } from "./models";

export class FingerPrintFactory {
  async generate(): Promise<FingerPrint> {
    const n = window.navigator;
    const fingerPrint: FingerPrint = {
      geo: {
        timezone: new Date().getTimezoneOffset(),
        languages: n.languages,
      },
      device: {
        platform: n.platform,
        // @ts-ignore
        oscpu: n.oscpu,
        hardwareConcurrency: n.hardwareConcurrency,
        // @ts-ignore
        ram: n.deviceMemory,
        gpu: await this.detectGPU(),
        screen: {
          width: window.screen.width * window.devicePixelRatio,
          height: window.screen.height * window.devicePixelRatio,
          colorDepth: window.screen.colorDepth,
        },
        // @ts-ignore
        keyboard: n.keyboard ? await n.keyboard.getLayoutMap() : undefined,
        maxTouchPoints: n.maxTouchPoints,
        // @ts-ignore
        battery: n.getBattery ? await n.getBattery() : undefined,
        mediaDevices: await n.mediaDevices.enumerateDevices(),
        gamePads: n.getGamepads(),
        fonts: await this.detectFonts(),
      },
      network: {
        // @ts-ignore
        connection: n.connection,
        localIP: await this.detectLocalIP(),
      },
      browser: {
        app: {
          codeName: n.appCodeName,
          name: n.appName,
          version: n.appVersion,
        },
        // @ts-ignore
        buildID: n.buildID,
        product: n.product,
        productSub: n.productSub,
        vendor: n.vendor,
        vendorSub: n.vendorSub,
        userAgent: n.userAgent,
        cookieEnabled: n.cookieEnabled,
        doNotTrack: n.doNotTrack,
        javaEnabled: n.javaEnabled(),
        mimeTypes: n.mimeTypes,
        plugins: n.plugins,
        canvas: await this.detectCanvas(),
        webGL: await this.detectWebGL(),
        adBlocker: await this.detectAdBlockers(),
      },
      social: await this.detectSocialMedia(),
    };
    return fingerPrint;
  }
  /**
   * JavaScript code to detect available availability of a
   * particular font in a browser using JavaScript and CSS.
   *
   * Author : Lalit Patel
   * Website: http://www.lalit.org/lab/javascript-css-font-detect/
   * License: Apache Software License 2.0
   *          http://www.apache.org/licenses/LICENSE-2.0
   * Version: 0.15 (21 Sep 2009)
   *          Changed comparision font to default from sans-default-default,
   *          as in FF3.0 font of child element didnt fallback
   *          to parent element if the font is missing.
   * Version: 0.2 (04 Mar 2012)
   *          Comparing font against all the 3 generic font families ie,
   *          "monospace", "sans-serif" and "sans". If it doesn't match all 3
   *          then that font is 100% not available in the system
   * Version: 0.3 (24 Mar 2012)
   *          Replaced sans with serif in the list of baseFonts
   */
  async detectFonts(): Promise<FontMap> {
    /**
     * Usage: d = new Detector();
     *        d.detect("font name");
     */
    // a font will be compared against all the three default fonts.
    // and if it doesn't match all 3 then that font is not available.
    const baseFonts = ["monospace", "sans-serif", "serif"];
    // we use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    const testString = "mmmmmmmmmmlli";
    // we test using 72px font size, we may use any size. I guess larger the better.
    const testSize = "72px";
    const body = document.getElementsByTagName("body")[0];
    // create a SPAN in the document to get the width of the text we use to test
    const span = document.createElement("span");
    span.style.fontSize = testSize;
    span.innerHTML = testString;
    const defaultWidth: { [key: string]: number } = {};
    const defaultHeight: { [key: string]: number } = {};
    for (const index in baseFonts) {
      // get the default width for the three base fonts
      span.style.fontFamily = baseFonts[index];
      body.appendChild(span);
      defaultWidth[baseFonts[index]] = span.offsetWidth; // width for the default font
      defaultHeight[baseFonts[index]] = span.offsetHeight; // height for the defualt font
      body.removeChild(span);
    }

    function detect(font: string): boolean {
      let detected = false;
      for (const index in baseFonts) {
        span.style.fontFamily = font + "," + baseFonts[index]; // name of the font along with the base font for fallback.
        body.appendChild(span);
        const matched =
          span.offsetWidth != defaultWidth[baseFonts[index]] ||
          span.offsetHeight != defaultHeight[baseFonts[index]];
        body.removeChild(span);
        detected = detected || matched;
      }
      return detected;
    }
    const fonts: FontMap = {};
    FONTS.forEach((font: string) => {
      fonts[font] = detect(font);
    });
    return fonts;
  }
  // Detect Local IP with WebRTC https://github.com/diafygi/webrtc-ips
  async detectLocalIP(): Promise<string | undefined> {
    // compatibility for firefox and chrome
    /* let RTCPeerConnection =
      // @ts-ignore
      window.RTCPeerConnection ||
      // @ts-ignore
      window.mozRTCPeerConnection ||
      // @ts-ignores
      window.webkitRTCPeerConnection;
    // @ts-ignores
    let useWebKit = !!window.webkitRTCPeerConnection;
    // bypass naive webrtc blocking using an iframe
    if (!RTCPeerConnection) {
      // NOTE: you need to have an iframe in the page right above the script tag
      //
      // <iframe id="iframe" sandbox="allow-same-origin" style="display: none"></iframe>
      // <script>...getIPs called in here...
      //
      const win = iframe.contentWindow;
      RTCPeerConnection =
        win.RTCPeerConnection ||
        win.mozRTCPeerConnection ||
        win.webkitRTCPeerConnection;
      useWebKit = !!win.webkitRTCPeerConnection;
    } */

    // construct a new RTCPeerConnection
    const peerConnection: RTCPeerConnection = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.services.mozilla.com" }],
    });
    // create a bogus data channel
    peerConnection.createDataChannel("");
    // create an offer sdp
    const description = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(description);
    if (peerConnection.localDescription) {
      const lines = peerConnection.localDescription.sdp.split("\n");
      const IPAddresses = lines
        .filter(line => line.indexOf("a=candidate:") === 0)
        .map(line => {
          // match just the IP address
          const IPRegex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/;
          const match = IPRegex.exec(line);
          if (match) {
            return match[1];
          }
          return undefined;
        });
      return IPAddresses[0];
    }
    return undefined;
  }
  // Detect GPU https://gist.github.com/cvan/042b2448fcecefafbb6a91469484cdf8
  async detectGPU(): Promise<GPU | undefined> {
    try {
      const canvas = document.createElement("canvas");
      const gl =
        canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
      if (gl) {
        const debugInfo = gl.getExtension("WEBGL_debug_renderer_info");
        if (debugInfo) {
          const vendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
          const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
          return { vendor, renderer };
        }
      }
    } catch (e) {}
    return undefined;
  }
  async detectAdBlockers(): Promise<boolean> {
    try {
      await fetch(
        new Request(
          "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
          {
            method: "HEAD",
            mode: "no-cors",
          }
        )
      );
      return false;
    } catch (error) {
      return true;
    }
  }
  // Detect Social Media https://robinlinus.github.io/socialmedia-leak/
  async detectSocialMedia(): Promise<SocialMap> {
    const socialMap: SocialMap = {};
    SOCIAL_MEDIA_PLATFORMS.map(async platform => {
      var img = document.createElement("img");
      img.referrerPolicy = "no-referrer";
      img.src = platform.domain + platform.redirect;
      img.onload = () => {
        socialMap[platform.name] = true;
      };
      img.onerror = () => {
        socialMap[platform.name] = false;
      };
    });
    return new Promise(resolve => {
      setTimeout(() => resolve(socialMap), 1000);
    });
  }
  // Canvas Fingerprinting https://browserleaks.com/canvas
  async detectCanvas(): Promise<string> {
    return "";
  }
  async detectWebGL(): Promise<string> {
    return "";
  }
}
