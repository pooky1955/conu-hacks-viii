<script>
	import { roomStore } from "./store.js"
	export let turn
</script>

<div class="player-card">
	<div class="card-body">
		{#each $roomStore.teams as team, i}
			<div class="team" class:active={turn == team.id} style={"--team-color: " + team.color + ";"}>
				<span class="team-color"></span>
				<div class="team-players">
					{#each roomStore.getTeamPlayers(team.id) as player}
						<div class="player">
							<div class="player-name">
								<span>{player.username}</span>
							</div>
						</div>
					{/each}
					{#if roomStore.getTeamPlayers(team.id).length == 0}
						<div class="player">
							<div class="player-name no-players">
								<span>No player</span>
							</div>
						</div>
					{/if}
				</div>
			</div>
			{#if i != $roomStore.teams.length - 1}
				<span class="vs">VS</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.card-body {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 1.35em;
	}

	.team {
		display: flex;
		gap: 0.5em;
		align-items: center;
		width: 10em;
		text-align: left;
		padding: 0.5em 0.9em;
		background-color: #f6ebe0;
		border-radius: 0.25em;
		box-shadow: 0 0.25em 0.25em rgba(0, 0, 0, 0.1);
		transition: all 0.2s ease-in-out;
	}

	.team-players {
		display: flex;
		flex-direction: column;
		flex-grow: 1;
		justify-content: center;
	}

	.team-color {
		background-color: var(--team-color);
		min-width: 0.9em;
		aspect-ratio: 1;
		border: 1px solid #4883b5;
		border-radius: 50%;
		display: inline-block;
	}

	.active {
		box-shadow: 0 0.25em 0.25em rgba(0, 0, 0, 0.2);
		border: 0.1.8em solid var(--team-color);
	}

	.player {
		width: fit-content;
	}

	.player-name {
		font-size: 1.13em;
	}

	.no-players {
		color: #4883b5;
	}

	@media (max-width: 640px) {
		.card-body {
			gap: 0.5em;
		}

		.team {
			width: 6em;
		}

		.player-name {
			font-size: 0.9em;
		}
	}
</style>
