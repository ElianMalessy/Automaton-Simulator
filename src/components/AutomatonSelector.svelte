<script lang="ts">
  import Select, {Option} from '@smui/select';

  import {theme} from './../context/store';

  let val: string = 'DFA';
</script>

<div class="flex ml-8">
  <div>
    {#if theme}
      <Select variant="outlined" bind:value={$theme} label="Theme" class="class">
        <Option value="" />
        {#each ['ambiance', 'chaos', 'chrome', 'clouds_midnight', 'clouds', 'cobalt', 'crimson_editor', 'dawn', 'dracula', 'monokai'] as theme}
          <Option value={theme}>{theme}</Option>
        {/each}
      </Select>
    {/if}
  </div>
  <div class="ml-2">
    <Select variant="outlined" bind:value={val} label="Option" class="class">
      <Option value="" />
      {#each ['DFA', 'NFA', 'Regex', 'CFG', 'TM'] as option}
        <Option value={option}>{option}</Option>
      {/each}
    </Select>
  </div>
</div>

<style>
  :global(.mdc-notched-outline__notch) {
    border-left: none;
    border-right: none;
  }
</style>
