<script lang="ts">
  import {SvelteUIProvider} from '@svelteuidev/core';
  import Editor from './components/Editor.svelte';
  import Navbar from './components/Navbar.svelte';

  let isDark: boolean = true;
  function toggleTheme() {
    isDark = !isDark;
  }

  // const config: SvelteUITheme = {
  //colorScheme: 'dark',
  //light: {bg: 'rgb(240, 231, 219)', color: 'rgb(26, 32, 44)'},
  //dark: {bg: 'rgb(32, 32, 35)', color: 'rgba(255, 255, 255, 0.92)'},
  // };
</script>

<SvelteUIProvider withGlobalStyles themeObserver={isDark ? 'dark' : 'light'}>
  <main>
    <Navbar {toggleTheme} />
    <Editor />
  </main>
</SvelteUIProvider>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
  body {
    padding: 0;
  }
</style>
