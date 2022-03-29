
<!--
  User profile page.
-->


<!-- <script context="module">
import { accessToken, auth } from '../../stores.js';

async function load({event}) {
  pevent.request.cookie
  const cookies = cookie.parse(event.request.headers.get('cookie') || '');
  console.log("svelte user-module");
  return {
    props: {
      fromModule: 'user-module'
    }
  };
}
</script> -->


<script>

import { onDestroy } from 'svelte';
import { goto } from '$app/navigation';
import { auth } from '../../stores.js';

export let fromModule = '';
let authob = {};
// let authTimer;

const unsubAuth = auth.subscribe(value => {
  if (value && (value.userident || value.resetted)) {
    authob = value;
    if (value.resetted) {
      // authTimer = setTimeout(() => goto('/'), 1000);
      goto('/');
    }
  }
})

onDestroy(() => {
  unsubAuth();
  // if (authTimer) {
  //   clearTimeout(authTimer);
  //   authTimer = undefined;
  // }
})

</script>

<svelte:head>
	<title>User {authob.userident || 'Not logged in'}</title>
</svelte:head>

<div>{authob.userident}</div>
