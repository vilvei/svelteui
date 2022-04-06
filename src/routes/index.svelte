
<!-- <script context="module">
import { decode } from 'js-base64';

	// export const prerender = true;
	// let api = import.meta.env.BEEBEES_API;
	export async function load({fetch, session}) {

		// clean roles here, if there is more than 15 roles and time is up.
		// open jwt payload. Check roles.
		// If rolesCreated + 3 days < now ANd there is more than 15 roles
		// ${API}/user/createtoken?clearroles=true

		let newtoken = '';
		if (session.accAuth && Array.isArray(session.accAuth.roles)) {
			// use is logged in, and has some roles
			if (session.accAuth.roles.length > 15) {
				// let's clear these time to time
				const rolesCreated = new Date(session.accAuth.rolesCreated);
				if (rolesCreated.getTime() + 3 * 68400000 < Date.now()) {
					const resp0 = await fetch(`${session.API}/user/createtoken?clearroles=true`, {
						credentials: 'include',
						headers: { 'authorization': session.accToken }
					});
					if (resp0.ok) {
						newtoken = await resp0.text();
					}
				}
			}
		}


		console.log("index load, session: ");
		console.log(session);
		let status = 200;
		try {
			// const api = session.BEEBEES_API;
			const resp = await fetch(`${session.API}/info`);
			status = resp.status;
			if (!resp.ok) {
				throw (await resp.text());
			}
			const apiInfo = await resp.json();
			apiInfo.api = session.API;
			return {
				status,
				props: {
					apiInfo, newtoken
				}
			}
		} catch (exp) {
			return {
				status,
				error: exp.toString()
			}
		}
	}

</script> -->

<script>
import { onDestroy } from 'svelte';
import { goto } from '$app/navigation';
// import { get } from 'svelte/store';
// import { session } from "$app/stores";
// const { API } = get(session);

import { accessToken, auth } from '../stores.js';
import { getLoginPoint, refreshToken, retrieveTokenPayload, dofetch } from '../dofetch.js';

const apipoint = getLoginPoint();
export let apiInfo = {};
export let newtoken = '';
// const api = import.meta.env.API;

// {userident, roles: []}
let authob = null;
const unsubAuth = auth.subscribe(value => {
	console.log("index-auth.sub: ");
	console.log(value);


	if (value && (value.userident || value.resetted)) {
		authob = value;

		// if (authob.userident) {
		// 	console.log("authob.userident: "+ authob.userident);
		// 	// logged in.
		// 	//testing roles
		// 	dofetch(`/user/hasroles/${encodeURIComponent(authob.userident)}`, {
		// 		body: JSON.stringify('admin-league-Dooms day')//,
		// 	}).then(resp => {
		// 		return resp.json();
		// 	})
		// 	.then(outdata => {
		// 		console.log("hasroles outdata: "+ JSON.stringify(outdata))
		// 	})
		// 	.catch(err => {
		// 		console.log("error with hasroles:");
		// 		console.log(err);
		// 	});
		// }

		return;
	}
	// ask for new new token. If there is no token, then user is not logged in.


	// fetch(`${apipoint}/user/createtoken`, {credentials: 'include'}).then(async resp => {
	// 	if (!resp.ok) {
	// 		const text = await resp.text();
	// 		console.log("resp NOT ok: "+ text)
	// 		throw text;
	// 	}
	// 	return resp.text();
	// })

	refreshToken()
		.then(token => {
			if (!token) { throw 'No token'; }
			console.log("token");
			console.log(token);
			const tpayload = retrieveTokenPayload(token);
			if (tpayload) {
				auth.update(() => tpayload);
				accessToken.update(() => token);
			}
		}).catch(async errp => {
			const err = await errp;
			console.log("Failed to create token:");
			console.log(err);
		});

});

// if (newtoken) {
// 	accessToken.update(() => newtoken);
// 	newtoken = '';
// }

onDestroy(() => {
	unsubAuth();
})

function createTeamsC() {
	console.log("createTeamsC");
	goto('/teams');
}

function printCardsC() {
	console.log("printCardsC");
	goto('/cards');
}

</script>

<svelte:head>
	<title>Beebees.live</title>
</svelte:head>


	<!-- Offer two big boxes: +create-teams +print-cards -->
	<div class="twowidegrid">
		<div class="plate" on:click={createTeamsC}>Create Teams</div>
		<div class="plate" on:click={printCardsC}>Print cards</div>
	</div>


	<!-- <div>to your new SvelteKit app</div>
	<button class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-yellow-400 transition duration-200 ease-in-out hover:bg-gray-900">Button</button> -->
	<!-- <div>api: {apiInfo.api}</div>
	<div>{apiInfo.service}</div>
	<div>{apiInfo.version}</div>
	<div>{apiInfo.time}</div> -->

<style>

	/* div {
		@apply text-4xl bg-gray-800 text-yellow-400 py-2 px-6 font-bold;
	} */

	.plate {
		@apply text-4xl bg-gray-800 text-yellow-400 py-2 px-6 font-bold;
		display: flex;
		justify-content: center;
		text-align: center;
		align-items: center;
		/* max-width: 45%; */
	}

	.twowidegrid {
		display: grid;
		margin: 0 auto;
		/* max-width: 80%; */
		width: 80%;
		min-height: 200px;
		gap: 20px;
		grid-template-columns: repeat(2, max(50%, 200px));
	}

</style>
