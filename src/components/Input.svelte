<script lang="ts">
  import {getContext, onMount} from 'svelte';
  import type {Writable} from 'svelte/store';

  import Textfield from '@smui/textfield';
  import IconButton, {Icon} from '@smui/icon-button';
  import {Svg} from '@smui/common/elements';
  import HelperText from '@smui/textfield/helper-text';
  import {mdiTrashCanOutline, mdiTrashCan} from '@mdi/js';

  import {key} from '../context/key';
  import {stringinput} from '../context/store';

  const {getIsDark} = getContext(key);
  let isDark: Writable<boolean>;
  onMount(() => {
    isDark = getIsDark();
  });

  let textinput = " ";

  export function reset() {
    stringinput.set(textinput);
	}
</script>

<div class="flex align-center ml-8">
  <Textfield type="number" bind:value={textinput} label={"Input String"}>
    <IconButton on:click={() => (textinput = '')} slot="trailingIcon">
      <Icon component={Svg} viewBox="0 0 24 24">
        {#if $isDark}
          <path fill="currentColor" d={mdiTrashCanOutline} />
        {:else}
          <path fill="currentColor" d={mdiTrashCan} />
        {/if}
      </Icon>
    </IconButton>
  </Textfield>
  <div>
  Input: {textinput}   
  {#if String(textinput).slice(-3) === "000"}
	<p style="color: green"> Accepted</p>
  {:else}
    <p style="color: red"> Declined</p>
  {/if}
  </div>
</div>

