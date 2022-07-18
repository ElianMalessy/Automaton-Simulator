<script lang="ts">
  import {onMount} from 'svelte/internal';
  import {setContext} from 'svelte';

  import {key} from './context/key';
  import Navbar from './components/Navbar.svelte';
  import Display from './components/Display.svelte';
  import {isDark} from './context/store';
  import '../node_modules/svelte-material-ui/bare.css';

  let mainRef: HTMLElement;

  setContext(key, {
    getMainRef: (): HTMLElement => mainRef,
  });

  onMount(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      mainRef.classList.add('dark');
      isDark.set(true);
    } else {
      mainRef.classList.remove('dark');
      isDark.set(false);
    }
  });
</script>

<main class="w-screen h-screen fixed dark" bind:this={mainRef}>
  <Navbar />
  <Display />
</main>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;

  main {
    background-color: rgb(240, 231, 219);
    color: rgb(26, 32, 44);
    transition: 0.3s;
  }
  main.dark {
    background-color: rgb(32, 32, 35);
    color: rgba(255, 255, 255, 0.92) !important;
  }
</style>
