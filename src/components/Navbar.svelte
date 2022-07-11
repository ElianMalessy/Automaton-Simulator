<script lang="ts">
  import {H1} from 'attractions';
  import RadioGroup from './RadioGroup.svelte';
  import ToggleButton from './ToggleButton.svelte';
  import Input from './Input.svelte';
</script>

<nav class="flex h-12 py-3 px-6 align-center justify-center w-screen ">
  <H1 class="m-0" style="color: #6200ee">Automaton Simulator</H1>
  <RadioGroup />
  <Input />
  <ToggleButton />
</nav>
