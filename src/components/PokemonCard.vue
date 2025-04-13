<template>
  <div 
    class="pokemon-card" 
    :class="{ selected: isSelected }" 
    @click="handleClick"
  >
    <img 
      :src="pokemon.image" 
      :alt="pokemon.name" 
      class="pokemon-image"
    />
    <h3>{{ pokemon.name }}</h3>
    <p v-if="pokemon.types && pokemon.types.length">
      Tipus: {{ pokemon.types.join(', ') }}
    </p>
    <p>Punts: {{ pokemon.points }}</p>
    <p v-if="inBattle">Especial: {{ pokemon.special_power }}</p>
  </div>
</template>

<script>
export default {
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    },
    inBattle: {
      type: Boolean,
      default: false
    }
  },
  emits: ['toggle-selection'],
  methods: {
    handleClick() {
      this.$emit('toggle-selection', this.pokemon);
    }
  }
}
</script>

<style scoped>
.pokemon-card {
  text-align: center;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: rgba(255, 255, 255, 0.5);
  width: 100%;
  max-width: 200px;
  cursor: pointer;
}

.pokemon-image {
  width: 100px;
  height: 100px;
  object-fit: cover;
  margin-bottom: 10px;
  border-radius: 50%;
  border: 2px solid #4a90e2;
}

.selected {
  border: 2px solid green;
  background-color: rgba(0, 255, 0, 0.1);
}
</style>
