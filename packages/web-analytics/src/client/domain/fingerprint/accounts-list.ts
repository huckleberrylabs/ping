/*
Do not work (anymore)
  https://login.live.com/login.srf?wa=wsignin1.0&wreply=https%3A%2F%2Fprofile.microsoft.com%2FregsysProfilecenter%2FImages%2FLogin.jpg"
  https://tablet.www.linkedin.com/splash?redirect_url=https%3A%2F%2Fwww.linkedin.com%2Ffavicon.ico%3Fgid%3D54384%26trk%3Dfulpro_grplogo
  https://subscribe.washingtonpost.com/loginregistration/index.html#/register/group/default?action=login&destination=https:%2F%2Fwashingtonpost.com%2Ffavicon.ico
  https://www.instagram.com/accounts/login/?next=%2Ffavicon.ico
  https://www.spiegel.de/meinspiegel/login.html?backUrl=%2Ffavicon.ico
  https://stackoverflow.com/users/login?ssrc=head&returnurl=http%3a%2f%2fstackoverflow.com%2ffavicon.ico
  https://www.netflix.com/Login?nextpage=%2Ffavicon.ico
  https://www.flickr.com/signin/yahoo/?redir=https%3A%2F%2Fwww.flickr.com/favicon.ico
*/

// probing function
export function go(url: string) {
  const img = document.createElement("img");
  img.referrerPolicy = "no-referrer";
  img.src = url;
  img.onload = () => {
    console.log("success!");
  };
  img.onerror = () => {
    console.log("fail!");
  };
}

export const ACCOUNTS = {
  airbnb:
    "https://www.airbnb.com/login?redirect_params[action]=favicon.ico&redirect_params[controller]=home",
  github:
    "https://github.com/login?return_to=https%3A%2F%2Fgithub.com%2Ffavicon.ico%3Fid%3D1",
  slack:
    "https://slack.com/checkcookie?redir=https%3A%2F%2Fslack.com%2Ffavicon.ico%23",
  meetup:
    "https://secure.meetup.com/login/?returnUri=https%3A%2F%2Fwww.meetup.com%2Fimg%2Fajax_loader_trans.gif",
  facebook:
    "https://www.facebook.com/login.php?next=https%3A%2F%2Fwww.facebook.com%2Ffavicon.ico",
  gmail:
    "https://accounts.google.com/ServiceLogin?passive=true&continue=https%3A%2F%2Fwww.google.com%2Ffavicon.ico&uilel=3&hl=en&service=mail",
  youtube:
    "https://accounts.google.com/ServiceLogin?passive=true&continue=https%3A%2F%2Fwww.youtube.com%2Ffavicon.ico&uilel=3&hl=en&service=youtube",
  spotify:
    "https://www.spotify.com/en/login/?forward_url=https%3A%2F%2Fwww.spotify.com%2Ffavicon.ico",
  // Unverified Below
  crea:
    "https://secure.realtorlink.ca/naflogin/naflogin.aspx?SiteDomain=tools.realtorlink.ca&targetURL=https%3A%2F%2Fwww.realtor.ca%2Ffavicon.ico",
  square: "https://squareup.com/login?return_to=%2Ffavicon.ico",
  twitter: "https://twitter.com/login?redirect_after_login=%2f..%2ffavicon.ico",
  skype:
    "https://login.skype.com/login?message=signin_continue&redirect_uri=https%3A%2F%2Fsecure.skype.com%2Ffavicon.ico",
  tumblr: "https://www.tumblr.com/login?redirect_to=%2Ffavicon.ico",
  dropbox:
    "https://www.dropbox.com/login?cont=https%3A%2F%2Fwww.dropbox.com%2Fstatic%2Fimages%2Fabout%2Fdropbox_logo_glyph_2015.svg",
  amazon:
    "https://www.amazon.com/ap/signin/178-4417027-1316064?_encoding=UTF8&openid.assoc_handle=usflex&openid.claimed_id=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.identity=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0%2Fidentifier_select&openid.mode=checkid_setup&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0&openid.ns.pape=http%3A%2F%2Fspecs.openid.net%2Fextensions%2Fpape%2F1.0&openid.pape.max_auth_age=10000000&openid.return_to=https%3A%2F%2Fwww.amazon.com%2Ffavicon.ico",
  foursquare: "https://de.foursquare.com/login?continue=%2Ffavicon.ico",
  blizzard:
    "https://eu.battle.net/login/de/index?ref=http://eu.battle.net/favicon.ico",
  steam: "https://store.steampowered.com/login/?redir=favicon.ico",
  academia: "https://www.academia.edu/login?cp=/favicon.ico&cs=www",
  medium:
    "https://medium.com/m/signin?redirect=https%3A%2F%2Fmedium.com%2Ffavicon.ico&loginType=default",
  edx: "https://courses.edx.org/login?next=/favicon.ico",
  khanacademy:
    "https://www.khanacademy.org/login?continue=https%3A//www.khanacademy.org/favicon.ico",
  paypal:
    "https://www.paypal.com/signin?returnUri=https://t.paypal.com/ts?v=1.0.0",
  "500px": "https://500px.com/login?r=%2Ffavicon.ico",
};
