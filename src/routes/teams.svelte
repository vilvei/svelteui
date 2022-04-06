
<script>


</script>


<svelte:head>
	<title>Teams</title>
</svelte:head>

<!--
  Show list of teams.
  + if logged in, show users teams from service.
  + if not logged in, show teams from persistent storage.
-->

<div class="plate">
  List of teams
</div>

<style>

.plate {
  @apply text-4xl bg-gray-800 text-yellow-400 py-2 px-6 font-bold;
  display: flex;
  justify-content: center;
  text-align: center;
  align-items: center;
  width: 200px;
  max-width: 200px;
  height: 200px;
  max-width: 200px;
}
</style>
