<script>
export default {
  name: 'PokemonBattleCard',
  props: {
    pokemon: {
      type: Object,
      required: true
    },
    isSelected: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<template>
  <div 
    class="pokemon-fighter" 
    :class="{ selected: isSelected }" 
  >
    <img :src="pokemon.image" :alt="pokemon.name" class="pokemon-image" />
    <h3>{{ pokemon.name }}</h3>
    <p v-if="pokemon.types && pokemon.types.length">
      Tipus: {{ pokemon.types.join(', ') }}
    </p>
    <p>Punts: {{ pokemon.points }}</p>
    <p v-if="pokemon.special_power">Especial: {{ pokemon.special_power }}</p>
  </div>
</template>

<style scoped>
.pokemon-fighter {
  width: 250px; 
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border: 2px solid black;
  background-color: rgba(255, 255, 255, 0.5);
}

.pokemon-image {
  width: 180px;
  height: 180px;
  object-fit: cover;
  border-radius: 50%;
  border: 3px solid #4a90e2;
}

.selected {
  border-color: #4CAF50;
  background-color: rgba(76, 175, 80, 0.1);
}
</style>
