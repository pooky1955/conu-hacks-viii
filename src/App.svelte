<script>
	import Board from './Board.svelte'
	import { socketStore, settingsStore, sessionStore, userStore, roomStore } from './store.js'
	import Bar from './Bar.svelte';
	import Join from './Join.svelte';
	import EndDialog from './EndDialog.svelte';
	import Chat from './Chat.svelte';
	import { onMount } from 'svelte';
	import { Peer } from "peerjs";
	import PlayerList from './PlayerList.svelte';
	import Status from './Status.svelte';
	import LiveGesture from './LiveGesture.svelte'
	import VideoFeed from './VideoFeed.svelte'

	onMount(() => {
		const session = $sessionStore;
		if (session) {
			$socketStore.auth = { sessionId: session };
			$socketStore.connect();
		}

		$socketStore.on("session", ({ sessionId, userId }) => {
			console.log("session", sessionId, userId)
			$socketStore.auth = { sessionId };
			$sessionStore = sessionId;
			$socketStore.userId = userId;
			$socketStore.emit('getUser', { id: $socketStore.userId}, (user) => {
				console.log("user", user)	
				$userStore = user
				console.log("userStore", $userStore)
			});
			$socketStore.emit('getRoomByPlayer', { id: $socketStore.userId }, (room) => {
				console.log("room", room)	
				$roomStore = room
				console.log("roomStore", $roomStore)
			});
		});

		$settingsStore.chatEnabled = false
	});

	$socketStore.on('updateRoom', (room) => {
		console.log("updateRoom", room)
		$roomStore = room

		if ($roomStore.players == 2) {
			$roomStore.board = JSON.parse($roomStore.board)
		}
	});

	$socketStore.on('leaveRoom', () => {
		$roomStore = {}
	});

	$socketStore.on('playSound', (url) => {
		if ($settingsStore.mute) return
		let soundPlayer = new Audio(url);
		soundPlayer.play()
	});
</script>

<Bar />
<main>
	<div class="content">
		{#if !$roomStore || Object.keys($roomStore).length == 0}
			<Join />
		{:else}
			<Status />
			<PlayerList players={$roomStore.players} teams={$roomStore.teams} turn={$roomStore.turn}/>
			<!-- <LiveGesture /> -->
			<VideoFeed />
			<!-- <Board board={$roomStore.board} width={$roomStore.boardWidth} height={$roomStore.boardHeight}/> -->
			<EndDialog />
			<Chat />
		{/if}
	</div>
</main>

<style>
	main {
		flex: 1 1 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;
		margin: 0;
		height: 100vh;
	}

	.content {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		min-height: 50%;
		width: 100%;
		gap: 1.8em;
	}
</style>