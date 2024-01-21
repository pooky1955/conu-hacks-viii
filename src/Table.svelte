<script>
  import { onMount } from "svelte";


    onMount(() => {
        alert('mounted canvas!')
        init()
        loop()

    })    


</script>
<div>

<canvas id="canvas"></canvas>

</div>