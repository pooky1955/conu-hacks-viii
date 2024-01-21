<script>
	import { onMount } from "svelte"
	import VideoFeed from "./VideoFeed.svelte"
	import LiveGesture from "./LiveGesture.svelte"
	import Status from "./Status.svelte"
	import { socketStore, roomStore } from "./store"

	const scorePointMe = () => {
		console.log("me")
		// console.log($roomStore.players)
		// console.log($socketStore.userId)
		// console.log($roomStore.players.filter((p) => p.userId == $socketStore.userId))
		// console.log(roomStore.getUserTeam($socketStore.userId))
		$socketStore.emit("scorePoint", { roomId: $roomStore.id, team: roomStore.getUserTeam($socketStore.userId) })
	}

	const scorePointYou = () => {
		console.log("you")
		// console.log($roomStore.players)
		// console.log($roomStore.players.filter((p) => p.userId != $socketStore.userId))
		// console.log(roomStore.getUserTeam($socketStore.userId))
		$socketStore.emit("scorePoint", { roomId: $roomStore.id, team: 1-roomStore.getUserTeam($socketStore.userId) })
	}

	window.scorePointMe = scorePointMe
	window.scorePointYou = scorePointYou
	onMount(() => {
		// alert("mounted canvas!")
		init()
		loop()
	})
</script>

<div id="table">
	<div id="status">
		<Status />
	</div>
	<div id="video">
		<VideoFeed />
	</div>
	<div id="liveGesture">
		<LiveGesture />
	</div>
	<canvas id="canvas"></canvas>
</div>

<style>
	#table {
		position: relative;
		width: 100%;
		height: 100vh;
	}

	#status {
		position: absolute;
		top: 2%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
	}

	#liveGesture {
		position: absolute;
		bottom: 5%;
		right: 5%;
		z-index: 2;
	}

	#video {
		position: absolute;
		top: 10%;
		/* left: 50%;
		transform: translateX(-50%); */
		z-index: 1;
		width: 100%;
	}

	#canvas {
		height: 100vh;
	}
</style>
