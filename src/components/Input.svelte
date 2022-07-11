<script lang="ts">
  import {getContext, onMount} from 'svelte';

  import Textfield from '@smui/textfield';
  import IconButton, {Icon} from '@smui/icon-button';
  import {Svg} from '@smui/common/elements';
  import HelperText from '@smui/textfield/helper-text';
  import {mdiTrashCanOutline, mdiTrashCan} from '@mdi/js';

  import {key} from '../context/key';

  const {getisDark} = getContext(key);
  let isDark: boolean;
  onMount(() => {
    isDark = getisDark();
  });

  let value: string = '';
</script>

<div class="flex align-center ml-10">
  <Textfield bind:value label="Input String">
    <IconButton on:click={() => (value = '')} slot="trailingIcon">
      <Icon component={Svg} viewBox="0 0 24 24">
        {#if isDark}
          <path fill="currentColor" d={mdiTrashCanOutline} />
        {:else}
          <path fill="currentColor" d={mdiTrashCan} />
        {/if}
      </Icon>
    </IconButton>
  </Textfield>
</div>
