import cookie from 'cookie';

// const MOD = import.meta.env.VITE_MOD;

// import { v4 as uuid } from '@lukeed/uuid';

// export const handle = async ({ event, resolve }) => {
// 	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
// 	event.locals.userid = cookies.userid || uuid();
//
// 	const response = await resolve(event);
//
// 	if (!cookies.userid) {
// 		// if this is the first time the user has visited this app,
// 		// set a cookie so that we recognise them when they return
// 		response.headers.set(
// 			'set-cookie',
// 			cookie.serialize('userid', event.locals.userid, {
// 				path: '/',
// 				httpOnly: true
// 			})
// 		);
// 	}
//
// 	return response;
// };


import { accessToken, auth } from './stores.js';
let accToken, accAuth;
accessToken.subscribe(value => accToken = value);
auth.subscribe(value => accAuth = value);

export const handle = async ({ fetch, event, resolve }) => {
	console.log("handle func: "+ event.request.url);
	const authstr = event.request.headers.get('authorization');

	console.log(" handle authstr: "+ authstr);

	const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	console.log(JSON.stringify(cookies));

	// if this is run in server, is these values set :: accToken, accAuth: ??

	// TODO
	// to this work on server-side, this code needs to check header, and parse authOb

	// this is for client-side: cleaning roles then and again.
	if (accToken && accAuth) {
		// TODO check if accessToken is about to expire --> refresh.
		// maybe seconds...
		let useToken = accToken;
		if (accAuth.exp * 60 > Math.floor(Date.now() / 1000)) {
			const resp = await fetch(`${import.meta.env.VITE_BEEBEES_API}/user/createtoken`);
			if (resp.ok) {
				useToken = await resp.text();
				const tokenparts = accToken.split('.').filter(pa => pa);
				if (tokenparts.length === 3) {
					const authob = JSON.parse(decode(tokenparts[1]));
					accessToken.update(() => useToken);
					auth.update(() => authob);
				}
			}
			else {
				// should redirect to /login ..?
			}
		}
		const repsonse = await resolve(event);
		event.request.headers.set('authorization', 'Bearer '+ useToken);
		return response;
	}

	return resolve(event);
}

export function getSession(event) {

	// retrieving cookie and possible auth-header and setting it to session
	// could benefit load-functions
	// const cookies = cookie.parse(event.request.headers.get('cookie') || '');
	// const bbscookie = cookies[`beebees${MOD}`];
	return {
		// https://beebees-dev.vilvei.workers.dev/api
		API: import.meta.env.VITE_BEEBEES_API,
		// bbscookie,
		// accAuth, accToken
		// ident: event.locals.ident
	};
}
