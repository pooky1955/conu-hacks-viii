<script>
	export let active = true,
		closeBtn = false
</script>

{#if active}
	<div class="overlay" on:click={() => (active = false)}></div>
{/if}
<dialog open={active}>
	{#if closeBtn}
		<div class="header">
			<button on:click={() => (active = false)}>
				<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</button>
		</div>
	{/if}
	<slot />
</dialog>

<style>
	.overlay {
		position: fixed;
		display: block;
		width: 100%;
		height: 100%;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-color: rgba(0, 0, 0, 0.5);
		z-index: 2;
		cursor: pointer;
	}

	.header {
		display: flex;
		width: 100%;
		justify-content: flex-end;
		align-items: center;
	}

	.header svg {
		height: 1.2em;
	}

	dialog[open] {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 0.5em;
		color: #4883b5;
		background: #fff6ec;
		width: 30em;
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		z-index: 3;
		padding: 0.9em;
		border-radius: 0.5em;
		cursor: default;
	}

	@media (max-width: 640px) {
		dialog[open] {
			width: 85%;
		}
	}
</style>
