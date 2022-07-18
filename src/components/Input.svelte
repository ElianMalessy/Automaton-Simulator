<script lang="ts">
  import Textfield from '@smui/textfield';
  import IconButton, {Icon} from '@smui/icon-button';
  import {Svg} from '@smui/common/elements';
  import {mdiTrashCanOutline, mdiTrashCan} from '@mdi/js';

  import {stringInput, isDark} from '../context/store';

  let textInput: string = '';

  export function reset() {
    stringInput.set(textInput);
  }
</script>

<div class="flex align-center ml-8">
  <Textfield bind:value={textInput} label={'Input String'}>
    <IconButton on:click={() => (textInput = '')} slot="trailingIcon">
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
    Input: {textInput}
    {#if String(textInput).slice(-3) === '000'}
      <p style="color: green">Accepted</p>
    {:else}
      <p style="color: red">Declined</p>
    {/if}
  </div>
</div>
