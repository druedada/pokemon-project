<template>
  <div class="battle-log-container">
    <h2>Registre de la Batalla</h2>
    <div id="battle-log" ref="battleLog">
      <div v-for="(entry, index) in entries" :key="index">
        <h2 v-if="entry.type == 'h2'">{{ entry.message }}</h2>
        <p v-else-if="entry.bold == false">{{ entry.message }}</p>
        <p v-else><b>{{ entry.message }}</b></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BattleLog',
  props: {
    entries: {
      type: Array,
      required: true
    }
  },
  updated() {
    const logDiv = this.$refs.battleLog;
    if (logDiv) {
      logDiv.scrollTo({ top: logDiv.scrollHeight, behavior: 'smooth' });
    }
  }
}
</script>
