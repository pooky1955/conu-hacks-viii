<script>
	import { socketStore, roomStore } from "./store.js"
	let status

	roomStore.subscribe(() => {
		if (!$roomStore) return
		if (!$roomStore.started) {
			status = "Waiting for other players"
		} else {
			status = "Play away"
		}
	})
</script>

<div>
	<span class="status">{status}...</span>
	<div class="players">
		{#each $roomStore.teams as team, i}
			<div class="team" style={"--team-color: " + team.color + ";"}>
				{#each roomStore.getTeamPlayers(team.id) as player}
					<span>{player.username}</span>
				{/each}
				{#if roomStore.getTeamPlayers(team.id).length == 0}
					<div class="player">
						<div class="player-name no-players">
							<span>No player</span>
						</div>
					</div>
				{/if}
				<span class="team-score">{team.score}</span>
			</div>
			{#if i != $roomStore.teams.length - 1}
				<span class="vs">VS</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.status {
		color: #9cd2ff;
		font-size: 2em;
		font-weight: 500;
		margin: 0;
		margin-bottom: 1rem;
		animation: breathing 5s infinite ease-in-out;
	}

	.players {
		display: flex;
		gap: 2rem;
		justify-content: center;
		align-items: center;
		background: #9b9b9b;
		padding: 0.2rem;
		border-radius: 0.5rem;
		font-weight: 600;
	}

	.team {
		display: flex;
		gap: 1rem;
		justify-content: center;
		align-items: center;
	}

	@keyframes breathing {
		0% {
			opacity: 1;
		}

		50% {
			opacity: 0.4;
		}

		100% {
			opacity: 1;
		}
	}

	@media (max-width: 640px) {
		.status {
			font-size: 1.13em;
		}
	}
</style>
