// import {CONSTANTS} from "./constants";

function parseJwt(token) {
  if (!token) return 0
  let base64Url = token.split('.')[1];
  let base64 = base64Url.replace('-', '+').replace('_', '/');
  return JSON.parse(window.atob(base64));
};
export const COMMON_APP = {
  //HOST_API: 'https://seo-backend.herokuapp.com/',
  HOST_API: '',
  getCookie: function (cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return null;
  },
  setCookie: function (cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
  },
  deleteCookie: function (name, path, domain) {
    // If the cookie exists
    if (this.getCookie(name))
      this.setCookie(name, "", -1, path, domain);
  },
  checkCookie: function (loginRes) {
    let tokenDecode = parseJwt(loginRes)
    let now = new Date();
    let checkExpiryDate = now / 1000 <= tokenDecode.exp
    if (loginRes === null || loginRes === undefined || loginRes === 'null' || loginRes === 'undefined' || !checkExpiryDate) {
      COMMON_APP.deleteCookie('_USER_LOGIN_')
      return false
    }
    return !!loginRes
  },
  parseJwt: function parseJwt(token) {
    if (!token) return 0
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  }
};
