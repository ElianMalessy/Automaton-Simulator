<script lang="ts">
  import {AceEditor} from '../../node_modules/svelte-ace';
  import 'brace/mode/elm';
  import 'brace/theme/monokai';

  export let text: string = '';
</script>

<div class="mt-3 px-6">
  <AceEditor width="40vw" height="70vh" lang="elm" theme="monokai" value={text} options={{showPrintMargin: false}} />
</div>
