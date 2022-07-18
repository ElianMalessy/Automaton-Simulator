<script lang="ts">
  import {getContext, onMount} from 'svelte';
  import IconButton, {Icon} from '@smui/icon-button';
  import {Svg} from '@smui/common/elements';
  import {mdiWeatherNight, mdiWeatherSunny} from '@mdi/js';

  import {key} from '../context/key';
  import {isDark} from '../context/store';

  const {getMainRef} = getContext(key);
  let mainRef: HTMLElement;
  onMount(() => {
    mainRef = getMainRef();
  });

  function toggleTheme(): void {
    mainRef.classList.toggle('dark');
    isDark.set(!$isDark);
  }
</script>

<IconButton
  on:click={toggleTheme}
  class="w-10 h-10 bg-orange-200 dark:bg-purple-600 rounded-md p-1 brightness-100 hover:brightness-75 ml-auto"
  ripple={false}
>
  <Icon component={Svg} viewBox="0 0 24 24">
    {#if $isDark}
      <path fill="currentColor" d={mdiWeatherNight} />
    {:else}
      <path fill="currentColor" d={mdiWeatherSunny} />
    {/if}
  </Icon>
</IconButton>
