<script context="module">
	// export const prerender = true;

	// let api = import.meta.env.BEEBEES_API;
	export async function load({fetch, session}) {
		console.log("index load, session: ");
		console.log(session);
		let status = 200;
		try {
			// const resp = await fetch(`${session.BEEBEES_API}/info`);
			const api = session.BEEBEES_API;
			const resp = await fetch(`${api}/info`);
			status = resp.status;
			if (!resp.ok) {
				throw (await resp.text());
			}
			return {
				status,
				props: { apiInfo: await resp.json() }
			}
		} catch (exp) {
			return {
				status,
				error: exp.toString()
			}
		}
	}

</script>

<script>
import { get } from 'svelte/store';
import { session } from "$app/stores";
const { BEEBEES_API } = get(session);

	export let apiInfo = {};
	// const api = import.meta.env.BEEBEES_API;
</script>

<svelte:head>
	<title>Home</title>
</svelte:head>

	<div>to your new SvelteKit app</div>
	<button class="inline-block cursor-pointer rounded-md bg-gray-800 px-4 py-3 text-center text-sm font-semibold uppercase text-yellow-400 transition duration-200 ease-in-out hover:bg-gray-900">Button</button>
	<div>api: {BEEBEES_API}</div>
	<div>{apiInfo.service}</div>
	<div>{apiInfo.version}</div>
	<div>{apiInfo.time}</div>

<style>

	div {
		@apply text-4xl bg-gray-800 text-yellow-400 py-2 px-6 font-bold;
	}
</style>
