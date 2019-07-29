import rp from "request-promise";

/* 

https://ddwiki.reso.org/display/DDW17

RETSClient

Actions

Update
Initialize

https://realtyna.com/blog/real-estate-listing-data-explained-mls-idx-rets-reso-vow-ddf/
https://medium.com/@patpohler/mls-idx-and-rets-c88d60edbad8

*/
export class RETSClient {
  auth: request.AuthOptions;
  cookie?: string;
  constructor(private loginURL: string, username: string, password: string) {
    this.auth = { username, password, sendImmediately: true };
  }
  async login() {
    const response = await rp.get(
      {
        uri: this.loginURL,
        withCredentials: true,
        auth: this.auth,
      },
      undefined
    );
    const cookie = response.headers["Set-Cookie"];
    if (typeof cookie === "string") {
      this.cookie = cookie;
    }
  }
  async logout(): Promise<void> {
    /* await axios.get(`${this.url}/Logout.svc/Logout`, {
      auth: this.auth,
      headers: {
        Cookie: this.cookie,
      },
    });
    this.cookie = undefined; */
  }
  async getObject(): Promise<void> {}
  async getMetadata(): Promise<void> {}
  async search(): Promise<void> {}
}
