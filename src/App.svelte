<script lang="ts">
  import {onMount} from 'svelte/internal';
  import {setContext} from 'svelte';
  import {Writable, writable} from 'svelte/store';

  import {key} from './context/key';

  import Editor from './components/Editor.svelte';
  import Navbar from './components/Navbar.svelte';

  import '../node_modules/svelte-material-ui/bare.css';

  let isDark: boolean = true;
  let mainRef: HTMLElement;
  setContext(key, {
    getisDark: (): boolean => isDark,
    getmainRef: (): HTMLElement => mainRef,
  });

  onMount(() => {
    if (
      localStorage.theme === 'dark' ||
      (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      mainRef.classList.add('dark');
      isDark = true;
    } else {
      mainRef.classList.remove('dark');
      isDark = false;
    }
  });
</script>

<main class="w-screen h-screen fixed dark" bind:this={mainRef}>
  <Navbar />
  <Editor />
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
    color: rgba(255, 255, 255, 0.92);
  }
</style>
