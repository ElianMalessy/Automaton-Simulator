<script lang="ts">
  import {AceEditor} from '../../node_modules/svelte-ace';
  import 'brace/mode/elm';
  import 'brace/theme/ambiance';
  import 'brace/theme/chaos';
  import 'brace/theme/chrome';
  import 'brace/theme/clouds_midnight';
  import 'brace/theme/clouds';
  import 'brace/theme/cobalt';
  import 'brace/theme/crimson_editor';
  import 'brace/theme/dawn';
  import 'brace/theme/dracula';
  import 'brace/theme/monokai';

  import {theme} from '../context/store';

  export let text: string = '';
</script>

<div class="px-6">
  <div>
    {#if $theme}
      <AceEditor width="40vw" height="80vh" lang="elm" theme={$theme} value={text} options={{showPrintMargin: false}} />
    {:else}
      <AceEditor width="40vw" height="80vh" lang="elm" value={text} options={{showPrintMargin: false}} />
    {/if}
  </div>
</div>
