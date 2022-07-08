<script lang="ts">
  import {AceEditor} from 'svelte-ace';
  import 'brace/mode/elm';
  import 'brace/theme/monokai';

  export let text = '';
</script>

<div class="mt-3 px-6">
  <AceEditor width="40vw" height="70vh" lang="elm" theme="monokai" value={text} options={{showPrintMargin: false}} />
</div>
