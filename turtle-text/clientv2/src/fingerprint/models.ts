export type FontMap = { [key: string]: boolean };
export type SocialMap = { [key: string]: boolean };

export type GPU = { vendor: string; renderer: string };

export type BatteryManager = {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
};

export type NetworkInformation = {
  downlink: number;
  effectiveType: string;
  rtt: number;
  saveData: boolean;
};

export type FingerPrint = {
  geo: {
    timezone: number;
    languages: readonly string[];
  };
  device: {
    platform: string;
    oscpu: string;
    hardwareConcurrency: number;
    ram: number;
    gpu: GPU | undefined;
    screen: {
      width: number;
      height: number;
      colorDepth: number;
    };
    keyboard: Map<string, string>;
    maxTouchPoints: number;
    battery: BatteryManager;
    mediaDevices: MediaDeviceInfo[];
    gamePads: (Gamepad | null)[];
    fonts: FontMap;
  };
  network: {
    localIP: string | undefined;
    connection: NetworkInformation;
  };
  browser: {
    app: {
      codeName: string;
      name: string;
      version: string;
    };
    buildID: string;
    product: string;
    productSub: string;
    vendor: string;
    vendorSub: string;
    userAgent: string;
    cookieEnabled: boolean;
    doNotTrack: string | null;
    javaEnabled: boolean;
    mimeTypes: MimeTypeArray;
    plugins: PluginArray;
    canvas: string;
    webGL: string;
    adBlocker: boolean;
  };
  social: SocialMap;
};
