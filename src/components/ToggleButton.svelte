<script lang="ts">
  import {getContext, onMount} from 'svelte';
  import IconButton, {Icon} from '@smui/icon-button';
  import {Svg} from '@smui/common/elements';
  import {mdiWeatherNight, mdiWeatherSunny} from '@mdi/js';

  import {key} from '../context/key';

  const {getisDark, getmainRef} = getContext(key);
  let isDark: boolean;
  let mainRef: HTMLElement;
  onMount(() => {
    isDark = getisDark();
    mainRef = getmainRef();
  });
  function toggleTheme(): void {
    mainRef.classList.toggle('dark');
    isDark = !isDark;
  }
</script>

<IconButton
  on:click={toggleTheme}
  class="ml-auto w-10 h-10  bg-orange-200 dark:bg-purple-600 rounded-md p-1 brightness-100 hover:brightness-75"
  ripple={false}
>
  <Icon component={Svg} viewBox="0 0 24 24">
    {#if isDark}
      <path fill="currentColor" d={mdiWeatherNight} />
    {:else}
      <path fill="currentColor" d={mdiWeatherSunny} />
    {/if}
  </Icon>
</IconButton>
