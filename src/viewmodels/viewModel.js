/**
 * @fileoverview ViewModel principal per a l'aplicació Pokémon Battle.
 * Gestiona la lògica de negoci i la comunicació entre la vista i el model.
 * 
 * Millores respecte a la versió CDN:
 * - Reactivitat millorada amb Vue 3 Composition API
 * - Millor organització del codi amb mòduls ES
 * - Tipat més segur amb JSDoc
 */

import { ref, reactive } from 'vue';
import { Player, PokemonList, PokemonTeam } from "../models/model.js";

/**
 * Classe principal que gestiona la lògica del joc
 * @class PokemonTeamViewModel
 */
export class PokemonTeamViewModel {
  constructor(jsonUrl = "/src/assets/pokemon_data.json") {
    this.player1 = reactive(new Player());
    this.player2 = reactive(new Player());
    this.currentPlayer = ref(this.player1);
    this.team = reactive(new PokemonTeam());
    this.pokemonList = reactive(new PokemonList());
    this.battleLog = ref([]);
    this.jsonUrl = jsonUrl;
  }

  /**
   * Carrega la llista de Pokémon des d'un fitxer JSON
   * @async
   */
  async fetchAndLoadPokemons() {
    try {
      console.log("Fetching from URL:", this.jsonUrl);
      const response = await fetch(this.jsonUrl);
      if (!response.ok) {
        throw new Error("HTTP error: " + response.status);
      }
      const data = await response.json();
      console.log("Data fetched:", data);
      this.pokemonList.loadPokemons(data);
    } catch (error) {
      console.error("Error loading Pokémon data:", error);
    }
  }

  /**
   * Inicialitza la partida amb dos jugadors
   * @param {string} player1Name - Nom del primer jugador
   * @param {string} player2Name - Nom del segon jugador
   */
  initializeMatch(player1Name, player2Name) {
    this.player1 = reactive(new Player(player1Name));
    this.player2 = reactive(new Player(player2Name));
    this.currentPlayer.value = this.player1;
  }

  /**
   * Canvia el jugador actual
   */
  switchPlayer() {
    this.currentPlayer.value = 
      this.currentPlayer.value === this.player1 ? this.player2 : this.player1;
    console.log(`Switched to player: ${this.currentPlayer.value.name}`);
  }

  /**
   * Obté el jugador actual
   * @returns {Player} El jugador actual
   */
  getCurrentPlayer() {
    return this.currentPlayer.value;
  }

  /**
   * Comprova si els equips dels jugadors estan complets
   * @returns {boolean} True si els equips estan complets
   */
  areTeamsComplete() {
    return this.player1.team.isFull() && this.player2.team.isFull();
  }

  /**
   * Afegeix un Pokémon a l'equip
   * @param {string} name - Nom del Pokémon
   */
  addPokemonToTeam(name) {
    const pokemon = this.pokemonList.getPokemonByName(name);
    if (!pokemon) {
      console.error("❌ Pokémon not found in the global list.");
      return;
    }

    if (this.team.getCredits() < pokemon.points) {
      console.error("❌ Not enough credits to add this Pokémon!");
      return;
    }

    const success = this.team.addPokemon(pokemon);
    if (!success) {
      console.warn(`⚠️ The Pokémon ${pokemon.name} is already on the team.`);
    }
  }

  /**
   * Afegeix un Pokémon a l'equip del jugador actual
   * @param {Object} pokemon - Objecte Pokémon
   * @returns {boolean} True si s'ha afegit correctament
   */
  addPokemonToCurrentPlayer(pokemon) {
    if (!this.currentPlayer.value?.team) {
      console.error('❌ No current player team available');
      return false;
    }

    const currentTeam = this.currentPlayer.value.team;
    
    if (currentTeam.credits < pokemon.points) {
      console.error(`❌ Not enough credits! Need ${pokemon.points}, but only have ${currentTeam.credits}`);
      return false;
    }

    if (currentTeam.selectedTeam.length >= currentTeam.maxTeamSize) {
      console.error(`❌ Team is full! Maximum size is ${currentTeam.maxTeamSize}`);
      return false;
    }

    const success = currentTeam.addPokemon(pokemon);
    if (success) {
      console.log(`✅ Added ${pokemon.name} to team. Credits remaining: ${currentTeam.credits}`);
    } else {
      console.error(`❌ ${pokemon.name} is already in the team`);
    }
    return success;
  }

  /**
   * Elimina un Pokémon de l'equip
   * @param {string} pokemonName - Nom del Pokémon
   * @returns {boolean} True si s'ha eliminat correctament
   */
  removePokemonFromTeam(pokemonName) {
    if (!this.currentPlayer.value?.team) return false;
    return this.currentPlayer.value.team.removePokemon(pokemonName);
  }

  /**
   * Ordena la llista global de Pokémon
   * @param {string} criteria - Criteri d'ordenació
   * @param {string} method - Mètode d'ordenació
   * @returns {Array} Llista global ordenada
   */
  sortGlobalList(criteria, method) {
    console.log(`Sorting with criteria: ${criteria}, method: ${method}`);
    this.pokemonList.sortPokemons(criteria, method);
    return this.getGlobalList();
  }

  /**
   * Obté la llista global de Pokémon
   * @returns {Array} Llista global de Pokémon
   */
  getGlobalList() {
    return this.pokemonList.allPokemons;
  }

  /**
   * Obté els detalls de l'equip
   * @returns {Object} Detalls de l'equip
   */
  getTeamDetails() {
    return this.team.getTeamDetails();
  }

  /**
   * Obté l'equip d'un jugador
   * @param {string} [player='Current'] - Jugador ('Current', 'Player1', 'Player2')
   * @returns {Array} Equip del jugador
   */
  getTeam(player='Current') {
    switch(player) {
      case 'Current':
        return this.currentPlayer.value?.team?.selectedTeam || [];
      case 'Player1':
        return this.player1?.team?.selectedTeam || [];
      case 'Player2':
        return this.player2?.team?.selectedTeam || [];
      default:
        return [];
    }
  }

  /**
   * Obté els crèdits disponibles del jugador actual
   * @returns {number} Crèdits disponibles
   */
  getCredits() {
    return this.currentPlayer.value?.team?.credits || 0;
  }

  /**
   * Estableix els noms dels jugadors
   * @param {string} player1Name - Nom del primer jugador
   * @param {string} player2Name - Nom del segon jugador
   */
  setPlayerNames(player1Name, player2Name) {
    this.player1.name = player1Name;
    this.player2.name = player2Name;
  }

  /**
   * Gestiona la selecció automàtica de l'equip per la CPU
   * Utilitza un algoritme aleatori per seleccionar Pokémon
   * respectant els límits de crèdits i mida de l'equip
   */
  autoSelectCpuTeam() {
    console.log("⚙️ Auto-selecting Pokémon for CPU...");
    const cpuTeam = this.player2.team;
    const availablePokemons = [...this.pokemonList.allPokemons];

    // Clear previous team if any
    cpuTeam.selectedTeam = [];
    cpuTeam.credits = 200; // Reset credits

    // Shuffle and select pokemons
    for (let i = availablePokemons.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [availablePokemons[i], availablePokemons[j]] = [availablePokemons[j], availablePokemons[i]];
    }

    for (let pokemon of availablePokemons) {
      if (cpuTeam.selectedTeam.length < cpuTeam.maxTeamSize && cpuTeam.credits >= pokemon.points) {
        cpuTeam.addPokemon(pokemon);
      }
      if (cpuTeam.selectedTeam.length >= cpuTeam.maxTeamSize) break;
    }

    console.log(`✅ CPU team selected with ${cpuTeam.selectedTeam.length} Pokémon`);
    return cpuTeam.selectedTeam;
  }

  /**
   * Executa la batalla entre els equips
   * Implementa un sistema de combat per torns amb
   * efectes visuals i registre de batalla
   */
  async startBattle() {
    // Reset battle log
    this.battleLog.value = [];
    this.addToBattleLog("🔥 Iniciant la batalla...", 'h2');
    this.addToBattleLog(`${this.player1.name} vs ${this.player2.name}`, 'h2');

    while (
      this.player1.team.selectedTeam.length > 0 &&
      this.player2.team.selectedTeam.length > 0
    ) {
      await this.fightRound();
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const winner =
      this.player1.team.selectedTeam.length > 0
        ? this.player1.name
        : this.player2.name;

    this.addToBattleLog(`🏆 La batalla ha acabat! ${winner} és el guanyador!`, 'h2', true);
  }

  /**
   * Afegeix un missatge al registre de batalla
   * @param {string} message - Missatge a afegir
   * @param {string} [type='p'] - Tipus d'element HTML
   * @param {boolean} [bold=false] - Si el missatge ha de ser en negreta
   */
  addToBattleLog(message, type='p', bold=false) {
    if (!Array.isArray(this.battleLog.value)) {
      this.battleLog.value = [];
    }
    this.battleLog.value.push({message, type, bold});
    console.log(message);
  }

  /**
   * Obté el registre de batalla
   * @returns {Array} Registre de batalla
   */
  getBattleLog() {
    return this.battleLog.value || [];
  }

  /**
   * Executa una ronda de combat
   * @returns {Promise<void>}
   */
  fightRound() {
    return new Promise((resolve) => {
      const pokemon1 = this.getRandomFighter(this.player1.team);
      const pokemon2 = this.getRandomFighter(this.player2.team);

      if (!pokemon1 || !pokemon2) return resolve();

      this.addToBattleLog(`⚔️ Nou combat!`, 'p');
      this.addToBattleLog(`${pokemon1.name} (${pokemon1.special_power}) vs ${pokemon2.name} (${pokemon2.special_power})`, 'p');

      setTimeout(() => {
        if (pokemon1.special_power === pokemon2.special_power) {
          this.addToBattleLog(`💥 ${pokemon1.name} i ${pokemon2.name} es derroten mútuament!`, 'p', true);
          this.player2.team.removePokemon(pokemon2.name);
          this.player1.team.removePokemon(pokemon1.name);
        } else if (pokemon1.special_power > pokemon2.special_power) {
          this.addToBattleLog(`💥 ${pokemon1.name} derrota ${pokemon2.name}!`);
          let damageMade = this.player2.team.removePokemon(pokemon2.name);
          let message = this.player1.team.decreaseSpecialPower(pokemon1.name, damageMade);
          this.addToBattleLog(message, 'p', true);
        } else {
          this.addToBattleLog(`💥 ${pokemon2.name} derrota ${pokemon1.name}!`);
          let damageMade = this.player1.team.removePokemon(pokemon1.name);
          let message = this.player2.team.decreaseSpecialPower(pokemon2.name, damageMade);
          this.addToBattleLog(message, 'p', true);
        }

        // Add team status after each round
        this.addToBattleLog(`📊 Estat dels equips:`, 'p');
        this.addToBattleLog(`${this.player1.name}: ${this.player1.team.selectedTeam.length} Pokémon`, 'p');
        this.addToBattleLog(`${this.player2.name}: ${this.player2.team.selectedTeam.length} Pokémon`, 'p');

        resolve();
      }, 3000);
    });
  }

  /**
   * Obté un lluitador aleatori d'un equip
   * @param {PokemonTeam} team - Equip del qual obtenir el lluitador
   * @returns {Object|null} Lluitador aleatori o null si no hi ha cap
   */
  getRandomFighter(team) {
    if (team.selectedTeam.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * team.selectedTeam.length);
    team.nobodyFights();
    team.selectedTeam[randomIndex].fights();
    return team.selectedTeam[randomIndex];
  }

  /**
   * Obté el Pokémon que està lluitant d'un jugador
   * @param {string} player - Jugador ('Player1', 'Player2')
   * @returns {Object|null} Pokémon que està lluitant o null
   */
  getWhoIsFighting(player) {
    switch(player) {
      case 'Player1':
        return this.player1.getWhoIsFighting();
      case 'Player2':
        return this.player2.getWhoIsFighting();
    }
    console.error('Nobody is fighting. There is no fight.');
  }
}