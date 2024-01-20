<script>
    export let valid = false
</script>

<div class="submit" class:valid={valid}>
    <slot name="button"></slot>
    <slot name="input"></slot>
</div>

<style>
    .submit {
        display: flex;
    }

    .submit * {
        border: 0.15em solid #ddd;
    }

    .submit :global(input) {
        border-right: none !important;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
        width: 5.734em;
        order: -1;
        border: 0.15em solid #ddd;
    }
     
    .submit :global(button) {
        border-left: none !important;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        background-color: #ddd;
        border: 0.15em solid #ddd;
    }

    .submit.valid :global(input), .submit.valid :global(input:hover), .submit.valid :global(input:focus) {
        border: 0.15em solid #eee4da;
    }

    .submit.valid :global(button) {
        border: 0.15em solid #eee4da;
        background-color: #eee4da;
    }
</style>