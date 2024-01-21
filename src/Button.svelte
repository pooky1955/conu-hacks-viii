<script>
	export let disabled = false
</script>

<button on:click {disabled}>
	<slot />
</button>

<style>
	button {
		border: none;
		background: #2a2a2a;
		cursor: pointer;
		outline: none;
		font-size: 1.25em;
		width: fit-content;
		color: #4883b5;
		padding: 0.5em 0.8em;
		border-radius: 0.25em;
		transition: all 0.2s ease-in-out;
		box-sizing: content-box;
		border: 0.15em solid #2a2a2a;
	}

	button:hover {
		background: #444;
		border: 0.15em solid #444;
	}

	button:disabled {
		background: #444;
		border: 0.15em solid #444;
		color: #222;
		cursor: not-allowed;
	}

	@media (max-width: 640px) {
		button {
			font-size: 0.9em;
		}
	}
</style>
