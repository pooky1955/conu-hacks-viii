<script>
    import Tile from './Tile.svelte';
    import { socketStore, roomStore } from './store.js'
    export let board, width, height;
    let selectedCol, userTeam, teamColors

    function handleMove(col) {
        $socketStore.emit('addToCol', { roomId: $roomStore.id, col})
    }

    function onMouseMove(e) {
        const boardClientWidth = e.target.clientWidth;
        const bounds = e.target.getBoundingClientRect();
        selectedCol = Math.floor((e.clientX - bounds.left)/(boardClientWidth/width));
        if (selectedCol < 0) selectedCol = 0;
        if (selectedCol > width-1) selectedCol = width-1;
    }

    function onColClick(e) {
        if (matchMedia('(hover: none)').matches) {
            onMouseMove(e);
        }
        handleMove(selectedCol);
    }

    userTeam = roomStore.getUserTeam($socketStore.userId)
    teamColors = roomStore.getTeamColors()
</script>

<div class="grid" style="--width: {width}; --height: {height};" on:mousemove={onMouseMove} on:click={onColClick}>
    {#each board as row, y}
		{#each row as tile, x} 
            <Tile active={tile.team >= 0} flashing={x == selectedCol && $roomStore.turn == userTeam} row={y + 1} color={teamColors[tile.team]} flashColor={teamColors[userTeam]}/>
		{/each}
	{/each}
</div>

<style>
	.grid {
		display: grid;
		position: relative;
        width: 30em;
        aspect-ratio: 1;
		margin: auto;
		grid-gap: 15px;
		padding: 15px;
        padding-top: 2em;
		background-image: linear-gradient(to bottom right, rgb(31 119 198), rgb(50, 96, 232));
        border-radius: 1.8em;
        box-shadow: 4px 6px 18px 5px #44444459;
        z-index: 1;
        grid-template-columns: repeat(var(--width), 1fr); 
        grid-template-rows: repeat(var(--height), 1fr);
	}

    @media (max-width: 640px) {
        .grid {
            width: 85%;
        }
    }
</style>