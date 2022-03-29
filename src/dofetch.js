
/**
  This is a handy helper to interact with api.
*/

import { decode } from 'js-base64';
import { accessToken, auth } from './stores.js';

const jsonType = 'application/json;charset=utf-8';

const apipoint = import.meta.env.VITE_BEEBEES_API;
let accToken = '';
let authPayload;
// api.subscribe(value => apipoint = value);
accessToken.subscribe(value => accToken = value);
auth.subscribe(value => authPayload = value);


async function dofetch(endpoint, opts = {}, fetch_) {
  if (!accToken || !apipoint) {
    return Promise.reject(!accToken ?
      "No auth token present to make api fetch" :
      "No apipoint present to make api fetch");
  }
  const usefetch = (fetch_ || fetch);

  let usetoken = accToken;
  let expireDiffSeconds = 100;
  if (authPayload) {
    // check if token needs to be refreshed.
    expireDiffSeconds = authPayload.exp - Math.ceil(Date.now() / 1000);
    if (expireDiffSeconds < 1) {
      // refresh now
      const ntoken = await refreshToken(usetoken, {fetch_: usefetch});
      usetoken = ntoken;
      // any big numer
      expireDiffSeconds = 100;

      const npayload = retrieveTokenPayload(ntoken);
      if (npayload) {
        auth.update(() => npayload);
      }
      accToken.update(() => ntoken);
    }
  }

  const useopts = Object.assign({}, opts);
  if (!useopts.headers) {
    useopts.headers = {};
  }
  if (useopts.body) {
    if (!useopts.method) {
      useopts.method = 'post';
    }
    if (!useopts.headers['content-type']) {
      useopts.headers['content-type'] = jsonType;
    }
  }
  useopts.headers.authorization = 'Bearer '+ usetoken;
  useopts.credentials = 'include';

  try {
    // apipoint ends with 'api';
    console.log("calling: "+ `${apipoint}${endpoint}`);
    const resp = await usefetch(`${apipoint}${endpoint}`, useopts);
    if (!resp.ok) {
      const errtext = await resp.text();
      if (errtext === 'Unauthorized') {
        // TODO maybe should refresh..
      }
      throw errtext;
    }

    if (expireDiffSeconds < 30) {
      // refresh now
      refreshToken(usetoken, {fetch_: usefetch}).then(ntoken => {
        const npayload = retrieveTokenPayload(ntoken);
        if (npayload) {
          auth.update(() => npayload);
        }
        accToken.update(() => ntoken);
      }).catch(err => {
        console.log("Token refresh did NOT work");
        console.log(err);
      });
    }

    // now the caller can do await text() or await json() or what-ever.
    return resp;
  } catch (exp) {
    console.log("EXP in dofetch");
    console.log(exp);
    return Promise.reject(exp.toString());
  }
}

function retrieveTokenPayload(token) {
  const parts = token.split('.').filter(pa => pa);
  if (parts.length === 3) {
    // const decoded = decode(parts[1]);
    // console.log("decoded: "+ decoded);
    // return JSON.parse(decoded);
    return JSON.parse(decode(parts[1]));
  }
}

async function refreshToken(token, {fetch_, clearRoles} = {}) {
  try {
    const usefetch = (fetch_ || fetch);
    const opts = {};
    if (token) { opts.headers = { authorization: 'Bearer '+ token }; }
    let url = `${apipoint}/user/createtoken`;
    if (clearRoles) { url += '?clearroles=true'; }
    const resp = await usefetch(url, opts);
    return resp.ok ? resp.text() : Promise.reject(await resp.text());
  } catch (exp) {
    return Promise.reject(exp.toString());
  }
}

function getApipoint() {
  return apipoint;
}

// function has
// const cookies = cookie.parse(event.request.headers.get('cookie') || '');
// const bbscookie = cookies[`beebees${MOD}`];

export { dofetch, refreshToken, getApipoint, retrieveTokenPayload }
