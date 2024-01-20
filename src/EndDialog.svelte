<script>
	import { roomStore, socketStore } from "./store.js"
	import Dialog from "./Dialog.svelte"
	import Button from "./Button.svelte"
	let closed = false, phrase = ""

	roomStore.subscribe(() => {
		if ($roomStore.winner != null) {
			if ($roomStore.winner == -1) {
				phrase = "drawed"
				return
			}

			if ($roomStore.winner == roomStore.getUserTeam($socketStore.userId))
				phrase = "won" + ($roomStore.players.length == 1 ? " by forfeit" : "")
			else
				phrase = "lost"
		}
	})
</script>

<Dialog active={$roomStore.winner != null && !closed}>
	<h2 class="win-status">You {phrase}</h2>
	<span>... in {(Date.parse($roomStore.finishedAt) - Date.parse($roomStore.startedAt)) / 1000} seconds</span>
	<div class="dialog-btns">
		<Button on:click={() => closed = true}>View Board</Button>
		<Button
			on:click={() => {
				$socketStore.emit("leaveRoom", { roomId: $roomStore.id })
			}}>Leave to Lobby</Button
		>
	</div>
</Dialog>

<style>
	.win-status {
		font-size: 1.8em;
		margin: 0;
	}

	.dialog-btns {
		display: flex;
		gap: 0.5em;
		margin-top: 1.8em;
	}
</style>
