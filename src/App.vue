<script>
import { ref, computed, inject, watch, onMounted, nextTick } from 'vue';
import { PokemonTeamViewModel } from "./viewmodels/viewModel.js";
import PokemonCard from './components/PokemonCard.vue';
import PokemonBattleCard from './components/PokemonBattleCard.vue';

export default {
  name: 'App',
  components: {
    PokemonCard,
    PokemonBattleCard
  },
  setup() {
    const viewModel = inject('viewModel');
    const currentScreen = ref('setup');
    const isTwoPlayers = ref(true);
    const player1Name = ref('');
    const player2Name = ref('');
    const currentPlayerSelectionMessage = ref('');
    const currentPlayerSelectionDisplay = ref('');
    const sortCriteria = ref('');
    const sortMethod = ref('');
    const globalPokemonList = ref([]);
    const buttonLabel = ref('Següent Jugador');
    const currentTurnDisplay = ref('És el torn del Jugador 1!');
    const currentTeam = ref([]);
    const showControls = ref(true);
    const battleLogRef = ref(null);

    const updateCurrentTeam = () => {
      try {
        const team = viewModel.getTeam('Current');
        currentTeam.value = Array.isArray(team) ? team : [];
      } catch (error) {
        console.error('Error updating team:', error);
        currentTeam.value = [];
      }
    };

    const startGame = () => {
      if (!player1Name.value || (isTwoPlayers.value && !player2Name.value)) {
        alert("Si us plau, introdueix els noms de tots els jugadors.");
        return;
      }
      
      if (!isTwoPlayers.value) {
        player2Name.value = "CPU";
      }
      
      viewModel.initializeMatch(player1Name.value, player2Name.value);
      currentPlayerSelectionMessage.value = `${player1Name.value}, selecciona el teu equip Pokémon`;
      globalPokemonList.value = viewModel.getGlobalList();
      currentScreen.value = 'teamSelection';
    };

    const startTeamSelection = () => {
      viewModel.initializeMatch(player1Name.value, player2Name.value);
      viewModel.currentPlayer = viewModel.player1;
      currentPlayerSelectionMessage.value = `${player1Name.value}, selecciona el teu equip Pokémon`;
      renderGlobalList();
    };

    const renderGlobalList = () => {
      globalPokemonList.value = viewModel.getGlobalList();
    };

    const handleSortOptions = () => {
      if (sortCriteria.value && sortMethod.value) {
        viewModel.sortGlobalList(sortCriteria.value, sortMethod.value);
        // Update the list after sorting
        globalPokemonList.value = viewModel.getGlobalList();
      }
    };

    const creditsDisplay = computed(() => {
      try {
        return viewModel?.getCredits() || 0;
      } catch (e) {
        console.error('Error getting credits:', e);
        return 0;
      }
    });

    const player1Team = computed(() => viewModel.getTeam('Player1'));
    const player2Team = computed(() => viewModel.getTeam('Player2'));
    const pokemon1Arena = computed(() => viewModel.getWhoIsFighting('Player1'));
    const pokemon2Arena = computed(() => viewModel.getWhoIsFighting('Player2'));
    const battleLog = computed(() => viewModel.getBattleLog());

    const isPokemonInTeam = (pokemonName) => {
      return currentTeam.value.some(pokemon => pokemon.name === pokemonName);
    };

    const handleToggleSelection = (pokemon) => {
      console.log('Toggle selection for:', pokemon.name);
      const isInTeam = currentTeam.value.some(p => p.name === pokemon.name);
      
      if (isInTeam) {
        viewModel.removePokemonFromTeam(pokemon.name);
      } else {
        const addResult =
          viewModel.addPokemonToCurrentPlayer(pokemon);
        if (!addResult) {
          alert("No es pot afegir el Pokémon.");
        }
      }
      // Force update the teams with proper array handling
      updateCurrentTeam();
      globalPokemonList.value = [...viewModel.getGlobalList()];
    };

    const handleNextPlayer = () => {
      if (!isTwoPlayers.value && viewModel.getCurrentPlayer().name === player1Name.value) {
        viewModel.switchPlayer();
        console.log("Generating CPU team...");
        viewModel.autoSelectCpuTeam();
        currentPlayerSelectionMessage.value = 'Equip seleccionat per la CPU:';
        buttonLabel.value = 'Fi de la selecció d\'equips';
        showControls.value = false;
        updateCurrentTeam();
      } else if (buttonLabel.value === 'Fi de la selecció d\'equips') {
        currentScreen.value = 'battleSection';
        currentTurnDisplay.value = `Comença la batalla! És el torn de ${player1Name.value}`;
      } else {
        viewModel.switchPlayer();
        if (viewModel.getCurrentPlayer().name === player2Name.value) {
          currentPlayerSelectionMessage.value = `${player2Name.value}, selecciona el teu equip Pokémon`;
          buttonLabel.value = 'Fi de la selecció d\'equips';
        } else {
          currentPlayerSelectionMessage.value = `${player1Name.value}, selecciona el teu equip Pokémon`;
        }
        updateCurrentTeam();
      }
    };

    const startBattle = async () => {
      currentScreen.value = 'battleArenaSection';
      await viewModel.startBattle();
    };

    watch(() => viewModel.getCurrentPlayer(), () => {
      updateCurrentTeam();
    });

    watch(isTwoPlayers, (newValue) => {
      if (!newValue) {
        player2Name.value = "CPU";
      } else if (player2Name.value === "CPU") {
        player2Name.value = "";
      }
    });

    watch(() => battleLog.value, () => {
      if (battleLogRef.value) {
        nextTick(() => {
          battleLogRef.value.scrollTop = battleLogRef.value.scrollHeight;
        });
      }
    }, { deep: true });

    onMounted(async () => {
      await viewModel.fetchAndLoadPokemons();
      updateCurrentTeam(); // Move this after data is loaded
    });

    return {
      currentScreen,
      isTwoPlayers,
      player1Name,
      player2Name,
      currentPlayerSelectionMessage,
      globalPokemonList,
      startGame,
      creditsDisplay,
      currentPlayerSelectionDisplay,
      sortCriteria,
      sortMethod,
      buttonLabel,
      currentTurnDisplay,
      startTeamSelection,
      renderGlobalList,
      player1Team,
      player2Team,
      pokemon1Arena,
      pokemon2Arena,
      battleLog,
      isPokemonInTeam,
      handleToggleSelection,
      handleSortOptions,
      handleNextPlayer,
      currentTeam,
      showControls,
      startBattle,
      battleLogRef
    };
  }
}
</script>

<template>
  <div>
    <h1 class="main-title">Pokémon Edició 2 Jugadors (o vs. CPU) amb Vite + Vue</h1>

    <section v-if="currentScreen === 'setup'" class="setup-container">
      <div class="setup-content">
        <h2 class="setup-title">Configuració dels Jugadors</h2>

        <div class="setup-form">
          <div class="toggle-container">
            <span>Dos Jugadors:</span>
            <label class="switch">
              <input 
                type="checkbox" 
                v-model="isTwoPlayers"
                id="twoPlayersToggle"
              />
              <span class="slider round"></span>
            </label>
          </div>

          <p class="setup-instructions">
            Introdueix els noms dels jugadors per començar el joc.
          </p>

          <div class="player-input-group">
            <label for="player1-name">Nom del Jugador 1:</label>
            <input 
              id="player1-name"
              type="text" 
              v-model="player1Name" 
              class="player-input"
            >
          </div>

          <div class="player-input-group" v-show="isTwoPlayers">
            <label for="player2-name">Nom del Jugador 2:</label>
            <input 
              id="player2-name"
              type="text" 
              v-model="player2Name" 
              class="player-input"
            >
          </div>

          <button 
            @click="startGame"
            class="setup-button"
            :disabled="!player1Name || (isTwoPlayers && !player2Name)"
          >
            Següent
          </button>
        </div>
      </div>
    </section>

    <section v-if="currentScreen === 'teamSelection'" id="team-selection-section">
      <h2>{{ currentPlayerSelectionMessage }}</h2>
      <h3>Crèdits restants: {{ creditsDisplay }}</h3>

      <div class="team-display">
        <h3>Equip Seleccionat</h3>
        <div id="selected-team-grid" class="grid-container">
          <pokemon-card
            v-for="pokemon in currentTeam"
            :key="pokemon.name"
            :pokemon="pokemon"
            :is-selected="true"
            @toggle-selection="handleToggleSelection"
          />
        </div>
      </div>

      <button 
        class="next-player-button"
        @click="handleNextPlayer"
      >
        {{ buttonLabel }}
      </button>

      <template v-if="showControls">
        <div id="sort-options-section">
          <h2>Opcions d'Ordenació</h2>
          <form id="sort-options-form">
            <div class="sort-fields-container">
              <fieldset>
                <legend>Ordena per:</legend>
                <label>
                  <input type="radio" name="sort-criteria" value="name" v-model="sortCriteria" />
                  Nom
                </label>
                <label>
                  <input type="radio" name="sort-criteria" value="points" v-model="sortCriteria" />
                  Punts
                </label>
                <label>
                  <input type="radio" name="sort-criteria" value="type" v-model="sortCriteria" />
                  Tipus
                </label>
              </fieldset>
              <fieldset>
                <legend>Mètode d'ordenació:</legend>
                <label>
                  <input type="radio" name="sort-method" value="bubble" v-model="sortMethod" />
                  Bombolla
                </label>
                <label>
                  <input type="radio" name="sort-method" value="insertion" v-model="sortMethod" />
                  Inserció
                </label>
                <label>
                  <input type="radio" name="sort-method" value="selection" v-model="sortMethod" />
                  Selecció
                </label>
              </fieldset>
            </div>
            <button type="button" id="sort-team" @click="handleSortOptions">
              Ordenar
            </button>
          </form>
        </div>

        <div id="pokemon-grid">
          <pokemon-card
            v-for="(pokemon, index) in globalPokemonList"
            :key="index"
            :pokemon="pokemon"
            :is-selected="isPokemonInTeam(pokemon.name)"
            @toggle-selection="handleToggleSelection"
          />
        </div>
      </template>
    </section>

    <section v-if="currentScreen === 'battleSection'" id="battle-section">
      <h2>Moment de la Batalla!</h2>
      <h1 id="current-turn-display">Comença la batalla: {{ player1Name }}!</h1>
      <button id="perform-attack-button" @click="startBattle">Atacar!</button>
    </section>

    <!-- Arena de Combat -->
    <section v-if="currentScreen === 'battleArenaSection'" id="battle-arena-section" style="display: block">
      <h2>Vista General dels Equips</h2>
      <h3 id="player1-team-name">Equip del Jugador {{player1Name}}</h3>
      <div id="player1-team-display" class="player1-selected-team-grid">
        <pokemon-card
          v-for="(poke, index) in player1Team"
          :key="index"
          :pokemon="poke"
          :inBattle="true"
          :is-selected="isPokemonInTeam(poke.name)"
        />
      </div>
      <h3 id="player2-team-name">Equip del Jugador {{player2Name}}</h3>
      <div id="player2-team-display" class="player2-selected-team-grid">
        <pokemon-card
          v-for="(poke, index) in player2Team"
          :key="index"
          :pokemon="poke"
          :inBattle="true"
          :is-selected="isPokemonInTeam(poke.name)"
        />
      </div>
      <div style="display: flex">
        <div id="pokemon1-display" class="pokemon-fighter">
          <pokemon-card
            v-if="pokemon1Arena"
            :pokemon="pokemon1Arena"
            :inBattle="true"
          />
        </div>
        <p class="vs-text">VS</p>
        <div id="pokemon2-display" class="pokemon-fighter">
          <pokemon-card
            v-if="pokemon2Arena"
            :pokemon="pokemon2Arena"
            :inBattle="true"
          />
        </div>
        <div class="battle-log-container">
          <h2>Registre de la Batalla</h2>
          <div id="battle-log" ref="battleLogRef" style="max-height: 300px; overflow-y: auto;">
            <div v-for="(entry, index) in battleLog" :key="index">
              <h2 v-if="entry.type == 'h2'">{{ entry.message }}</h2>
              <p v-else-if="entry.bold == false">{{ entry.message }}</p>
              <p v-else><b>{{ entry.message }}</b></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style>
@import './assets/style.css';
</style>