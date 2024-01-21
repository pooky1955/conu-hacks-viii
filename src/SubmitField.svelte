<script>
	export let valid = false
</script>

<div class="submit" class:valid>
	<slot name="button" />
	<slot name="input" />
</div>

<style>
	.submit {
		display: flex;
	}

	.submit * {
		border: 0.15em solid #444;
	}

	.submit :global(input) {
		border-right: none !important;
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		width: 5.734em;
		order: -1;
		border: 0.15em solid #444;
	}

	.submit :global(button) {
		border-left: none !important;
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
		background-color: #444;
		border: 0.15em solid #444;
	}

	.submit.valid :global(input),
	.submit.valid :global(input:hover),
	.submit.valid :global(input:focus) {
		border: 0.15em solid #2a2a2a;
	}

	.submit.valid :global(button) {
		border: 0.15em solid #2a2a2a;
		background-color: #2a2a2a;
	}
</style>
