<script>
import { onDestroy } from 'svelte';
import { page } from '$app/stores';
// import logo from './svelte-logo.svg';
import { accessToken, auth } from '../../stores.js';
import { getApipoint } from '../../dofetch.js';


let accToken = '';
let authPayload = {};
const unsubAccessToken = accessToken.subscribe(value => accToken = value);
const unsubAuth = auth.subscribe(value => {
	console.log("headers auth value: "+ JSON.stringify(value));
	if (value && (value.userident || value.resetted)) {
		authPayload = value;
	}
});

onDestroy(() => {
	console.log("onDestroy header");
	unsubAccessToken();
	unsubAuth();
})



async function logoutClicked() {
	console.log("logoutClicked");

	try {
		const apipoint = getApipoint();
		const resp = await fetch(`${apipoint}/user/logout`, {credentials: 'include'});
		if (!resp.ok) {
			throw await resp.text();
		}
		const outtext = await resp.text();
	} catch (exp) {
		console.log("EXP from logout");
		console.log(exp);
	}

	accessToken.update(() => '');
	auth.update(() => ({resetted: true}));
}

</script>

<header class="bg-gray-800 grid">

<!-- <div class="title text-yellow-400">BEEBEES</div> -->
<div class="title text-yellow-400">JEH</div>

<div class="dropdown dropdown-end">
	<label tabindex="0" class="btn btn-ghost btn-circle placeholder">
	<!-- <label tabindex="0" class="btn btn-ghost btn-circle avatar userblock"> -->
		<!-- <div class="w-10 rounded-full"> justify-center -->
		<div class="bg-neutral-focus text-neutral-content rounded-full h-full w-24 flex flex-col justify-center">
			<!-- <img src="https://api.lorem.space/image/face?hash=33791"> -->
			<!-- <span class="text-1g">uname-joo</span> -->


			<div class="bline"></div>
			<div class="bline"></div>
			<div class="bline"></div>

		</div>
	</label>

	<ul tabindex="0" class="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52">
		{#if authPayload.userident}
		<li>
			<div class="justify-between">
				<a href="/user">Profile</a>
				<span class="badge"><a href="#" on:click={logoutClicked}>Logout</a></span>
			</div>
		</li>
		{:else}
		<li><a href="/login">Login</a></li>



		<!-- <li><a href="/user">Profile</a></li>
		<li><a href="#" on:click={logoutClicked}>Logout</a></li> -->

		<!-- <li>
			<a class="justify-between">
				Profile
				<span class="badge">New</span>
			</a>
		</li>
		<li><a>Settings</a></li>
		<li><a href="#" on:click={logoutClicked}>Logout</a></li> -->

		{/if}


	</ul>
</div>

</header>

<style>
	header {
		/* display: flex;
		justify-content: space-between; */

		width: 100%;
		height: clamp(100px, 10vh, 150px);

		display: grid;
		grid-template-columns: 1fr 200px;
  	align-items: end;
		/* background-color: pink; */
	}

	.title {
		height: 100%;
		padding-left: clamp(50px, 10vw, 100px);
		display: flex;
		align-items: center;
		font-size: 400%;
		font-weight: 700;
	}

	.dropdown {
	  justify-self: end;
	}


	.bline {
		width: 60%;
		height: 3px;
		background-color: white;
		margin: 2px auto;
	}


</style>
