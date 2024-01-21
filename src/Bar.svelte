<script>
	import { roomStore, socketStore, settingsStore } from "./store.js"
</script>

<header>
	<h1>Finger Pong</h1>
	{#if $roomStore && Object.keys($roomStore).length != 0}
		<div class="side-left">
			<span>{$roomStore.id}</span>
			<button
				on:click={() => {
					navigator.clipboard.writeText($roomStore.id)
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
					/>
				</svg>
			</button>
		</div>
		<div class="side-right">
			<button
				on:click={() => {
					$socketStore.emit("leaveRoom", { roomId: $roomStore.id })
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
					/>
				</svg>
			</button>
			<button
				on:click={() => {
					$settingsStore.mute = !$settingsStore.mute
				}}
			>
				<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					{#if $settingsStore.mute}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
							clip-rule="evenodd"
						/>
						<path stroke-linecap="round" stroke-linejoin="round" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
						/>
					{/if}
				</svg>
			</button>
			<button
				on:click={() => {
					$settingsStore.chatEnabled = !$settingsStore.chatEnabled
				}}
			>
				{#if $settingsStore.chatNotifications}
					<span class="notification"></span>
				{/if}
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
					/>
				</svg>
			</button>
		</div>
	{/if}
</header>

<style>
	header {
		flex: 0 1 auto;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.9em;
		background: #2a2a2a;
		color: #4883b5;
	}

	h1 {
		order: 2;
		text-align: center;
		text-transform: uppercase;
		font-size: 1.8em;
		font-weight: 200;
		margin: auto;
		padding: 0.13em;
	}

	button {
		position: relative;
	}

	.side-left,
	.side-right {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		padding: 0 0.7em;
		gap: 0.5em;
		width: 10em;
	}

	.side-left {
		order: 1;
		margin-right: auto;
	}

	.side-right {
		order: 3;
		flex-direction: row-reverse;
		margin-left: auto;
	}

	.notification {
		height: 0.6em;
		background: linear-gradient(45deg, #ff6d6d, red);
		aspect-ratio: 1;
		position: absolute;
		border-radius: 50%;
		top: 1%;
		right: 1%;
	}

	header svg {
		width: 1.35em;
	}

	@media (max-width: 640px) {
		header {
			padding: 0.5em;
		}

		h1 {
			font-size: 1.35em;
		}

		.side-left,
		.side-right {
			width: 5em;
		}
	}
</style>
