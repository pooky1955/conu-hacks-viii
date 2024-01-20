<script>
    export let disabled = false
</script>

<button on:click {disabled}>
    <slot></slot>
</button>

<style>
    button {
        border: none;
        background: #eee4da;
        cursor: pointer;
        outline: none;
        font-size: 1.35em;
        width: fit-content;
        color: #776e65;
        padding: 0.5em 0.8em;
        border-radius: 0.25em;
        transition: all 0.2s ease-in-out;
        box-sizing: content-box;
        border: 0.15em solid #eee4da;
    }

    button:hover {
        background: #ddd;
        border: 0.15em solid #ddd;
    }

    button:disabled {
        background: #ddd;
        border: 0.15em solid #ddd;
        cursor: not-allowed;
    }

    @media (max-width: 640px) {
        button {
            font-size: 0.9em;
        }
    }
</style>