<script>
	import { createEventDispatcher } from "svelte"
	export let value = "",
		placeholder = "",
		disabled = false,
		autofocus = false,
		enterkeyhint = "enter"
	const dispatch = createEventDispatcher()

	const handleKeypress = (e) => {
		if (e.charCode === 13) {
			dispatch("submit", e)
		}
	}
</script>

<!-- svelte-ignore a11y-autofocus -->
<input type="text" {placeholder} {disabled} {autofocus} {enterkeyhint} bind:value on:input|preventDefault on:keypress={handleKeypress} />

<style>
	input {
		cursor: pointer;
		outline: none;
		font-size: 1.35em;
		width: 8em;
		color: #4883b5;
		padding: 0.5em 0.8em;
		border-radius: 0.25em;
		transition: all 0.2s ease-in-out;
		border: 0.15em solid #2a2a2a;
		margin: 0;
		box-sizing: content-box;
	}

	input:hover:not(:disabled),
	input:focus:not(:disabled) {
		border: 0.15em solid #444;
	}

	@media (max-width: 640px) {
		input {
			font-size: 0.9em;
		}
	}
</style>
