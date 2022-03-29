
<!-- <script context="module">
export async function load({fetch, session}) {

  let alreadyLoggedIn = false;
  if (session.bbscookie) {

  }

  let token = '';
  try {
    const resp = await fetch(`${API}/user/loggedin`);
    if (resp.ok) {
      token = await resp.text();
      alreadyLoggedIn = !!token;
    }
  } catch (exp) {}

  return {
    props: { alreadyLoggedIn, token }
  }
}
</script> -->


<script>
import { onDestroy } from 'svelte';
import { goto } from '$app/navigation';
// import { get } from 'svelte/store';
// import { session } from "$app/stores";
import { accessToken, auth } from '../stores.js';
import { getApipoint, retrieveTokenPayload } from '../dofetch.js';


// const { API } = get(session);

// export let alreadyLoggedIn = false;
// export let token = '';
let userident = '';
let password = '';

// if (alreadyLoggedIn) {
//   if (token) {
//     accessToken.update(() => token);
//     const tokenparts = token.split('.').filter(pa => pa);
//     if (tokenparts.length === 3) {
//       const authob = JSON.parse(decode(tokenparts[1]));
//       auth.update(() => authob);
//     }
//   }
//   goto('/', { replaceState: true });
//   return;
// }

// onMount(() => {
//
// })

let authob = null;
const unsubAuth = auth.subscribe(value => {
	console.log("login-auth.sub: ");
	console.log(value);
	if (!value || !value.userident) {
		// ask for new new token. If there is no token, then user is not logged in.

		const apipoint = getApipoint();

		fetch(`${apipoint}/user/createtoken`, {credentials: 'include'}).then(resp => {
			if (!resp.ok) { throw resp.text(); }
			return resp.text();
		}).then(token => {
			if (!token) { throw 'No token'; }
			console.log("token");
			console.log(token);
			const tpayload = retrieveTokenPayload(token);
			if (tpayload) {
				auth.update(() => tpayload);
				accessToken.update(() => token);
			}
      goto('/', { replaceState: true });

		}).catch(async errp => {
			const err = await errp;
			console.log("Failed to create token:");
			console.log(err);
		});

		return;
	}
	authob = value;
});

onDestroy(() => {
	unsubAuth();
})

async function submitClicked() {
  console.log("submitClicked: "+ userident +", "+ password);

  if (!userident || !password) {
    console.log("userident or password is empty");
    // TODO show toast
    return;
  }

  try {
    const apipoint = getApipoint();
    const resp = await fetch(`${apipoint}/user/login`, {
      method: 'post',
      // credentials: "same-origin",
      credentials: "include",
      body: JSON.stringify({userident, password}),
      headers: {'content-type': 'application/json;charset=utf-8'}
    });
    if (!resp.ok) {
      throw await resp.text();
    }

    console.log("ok login");
    const token = await resp.text();

    const authob = retrieveTokenPayload(token);
    if (authob) { auth.update(() => authob); }
    accessToken.update(() => token);

    goto('/', { replaceState: true });

  } catch (exp) {
    console.log("Fail with login");
    console.log(exp);

    // TODO
    // show toast about error
  }

}

</script>

<svelte:head>
	<title>Login</title>
</svelte:head>


<div class="content">

  <div class="text-gray-600">Please sign in </div>
  <!-- <div class="form-control w-full max-w-xs"> -->
  <!-- <label class="label">
    <span class="label-text">Your email address</span>
  </label> -->
    <input type="text" class="input input-bordered input-md w-full max-w-xs text-lg tracking-wider" bind:value={userident} placeholder="userident">
    <input type="password" class="input input-bordered input-md w-full max-w-xs text-lg tracking-wider" bind:value={password} placeholder="password">

    <button class="btn btn-active text-white" on:click={submitClicked}>submit</button>

  <!-- <label class="label">
    <span class="label-text-alt">Alt label</span>
    <span class="label-text-alt">Alt label</span>
  </label> -->
<!-- </div> -->

</div>


<style>
.content {
  margin-inline: auto;
  padding-top: 10vh;
}
</style>
