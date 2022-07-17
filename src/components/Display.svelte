<script lang="ts">
    import {getContext, onMount} from 'svelte';
    import type {Writable} from 'svelte/store';
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
  
    import {key} from '../context/key';
    import {value} from '../context/value';
  
    const {getTheme} = getContext(key);
    let theme: Writable<string>;
    onMount(() => {
      theme = getTheme();
    });
  
    export let text: string = '';
  </script>

<div class="columns">
  <div class="column">
    {#if $theme}
      <AceEditor width="40vw" height="80vh" lang="elm" theme={$theme} value={text} options={{showPrintMargin: false}} />
    {:else}
      <AceEditor width="40vw" height="80vh" lang="elm" value={text} options={{showPrintMargin: false}} />
    {/if}
  </div>
  <div class="column">
      <h1>Hi {value}</h1>
  </div>
</div>
  