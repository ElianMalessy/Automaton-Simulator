<script lang="ts">
  import {H1} from 'attractions';

  import RadioGroup from './RadioGroup.svelte';
  import ToggleButton from './ToggleButton.svelte';
  import Input from './Input.svelte';
</script>

<nav class="flex py-3 px-6 align-center justify-center w-screen">
  <div class="flex">
    <H1 class="title">Automaton Simulator</H1>
    <RadioGroup />
  </div>
  <Input />
  <ToggleButton />
</nav>
