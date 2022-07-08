<script lang="ts">
  import {Switch, Navbar} from '@svelteuidev/core';
  import {H1, RadioGroup} from 'attractions';
  const selections: {
    value: string;
    label: string;
  }[] = [
    {value: '1', label: 'DFA'},
    {value: '2', label: 'NFA'},
    {value: '3', label: 'Regex'},
    {value: '4', label: 'CFG'},
    {value: '5', label: 'TM'},
  ];
  export let toggleTheme: (e: CustomEvent<any>) => void;
</script>

<nav class="flex h-12 px-6 align-center w-screen">
  <H1 class="m-0">Automaton Simulator</H1>
  <RadioGroup name="machines" items={selections} on:change={(e) => console.log(e)} class="flex items-center" />
  <Switch class="ml-auto" on:change={toggleTheme} />
</nav>
