<script lang="ts">
  import Radio from '@smui/radio';
  import FormField from '@smui/form-field';

  let val: string = 'DFA';
</script>

<div class="radio-demo">
  {#each ['DFA', 'NFA', 'Regex', 'CFG', 'TM'] as option}
    <FormField>
      <Radio bind:group={val} value={option} touch />
      <span slot="label">{option}</span>
    </FormField>
  {/each}
</div>
