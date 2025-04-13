const MAX_CREDITS = 200;
const MAX_TEAM_SIZE = 6;

// Remove top-level await and use synchronous imports
const images = import.meta.glob('/src/assets/images/pokemon/*.png', { eager: true });
const pokemonImages = Object.fromEntries(
  Object.entries(images).map(([path, module]) => [
    path.split('/').pop().replace('.png', '').toLowerCase(),
    module.default
  ])
);

function getImagePath(name) {
  const normalizedName = name.toLowerCase();
  const imagePath = pokemonImages[normalizedName];
  
  if (!imagePath) {
    console.error(`Image not found for ${name}`);
    return pokemonImages['default'] || ''; // Fallback image
  }
  
  return imagePath;
}

// =========================
// Classe Base: Pokemon
// =========================
class Pokemon {
  constructor(id, name, image, points, special_power) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.points = points;
    this.special_power = special_power;
    this.isFighting = false;
  }

  displayDetails() {
    return `${this.name} (ID: ${this.id}) - Points: ${this.points}`;
  }
  fights(){
    this.isFighting = true;
  }
  doesntFight(){
    this.isFighting = false;
  }
}

// Classes heretades per cada tipus de Pokémon
class GrassPokemon extends Pokemon {}
class FirePokemon extends Pokemon {}
class WaterPokemon extends Pokemon {}
class ElectricPokemon extends Pokemon {}
class BugPokemon extends Pokemon {}
class NormalPokemon extends Pokemon {}
class PoisonPokemon extends Pokemon {}
class PsychicPokemon extends Pokemon {}
class GroundPokemon extends Pokemon {}
class FairyPokemon extends Pokemon {}
class RockPokemon extends Pokemon {}
class IcePokemon extends Pokemon {}
class DragonPokemon extends Pokemon {}
class DarkPokemon extends Pokemon {}
class SteelPokemon extends Pokemon {}
class GhostPokemon extends Pokemon {}
class FightingPokemon extends Pokemon {}
class FlyingPokemon extends Pokemon {}

// Classe: PokemonList
// =========================
export class PokemonList {
  constructor() {
    this._allPokemons = [];
    this.isLoaded = false; // Estat per saber si s'han carregat
  }
  get allPokemons() {
    const sortedPokemons = [...this._allPokemons]; // Còpia de l'array
    return sortedPokemons;
  }
  formatFilename(filename) {
    // Special cases with hyphens and special characters
    const specialCases = {
      'Nidoran♀': 'nidoran♀',
      'Nidoran♂': 'nidoran♂',
      'Porygon-Z': 'porygon-z',
      'Flabébé': 'flabébé',
      'Ho-oh': 'ho-oh',
      'Jangmo-o': 'jangmo-o',
      'Hakamo-o': 'hakamo-o',
      'Kommo-o': 'kommo-o',
      'Wo-Chien': 'wo-chien',
      'Chien-Pao': 'chien-pao',
      'Ting-Lu': 'ting-lu',
      'Chi-Yu': 'chi-yu'
    };

    // Check if it's a special case
    if (specialCases[filename]) {
      return specialCases[filename];
    }

    // Regular filename handling
    return filename.trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
      .replace(/[^a-z0-9\-]/g, ''); // Keep hyphens, remove other special chars
  }
  loadPokemons(data) {
    try {
      data.forEach((pokemon, index) => {
        const filename = this.formatFilename(pokemon.name);
        const imagePath = getImagePath(filename);
        
        if (!imagePath) {
          console.error(`Could not load image for ${pokemon.name}`);
          return;
        }

        // Replace eval with a safer alternative
        const PokemonClasses = {
          GrassPokemon, FirePokemon, WaterPokemon, ElectricPokemon,
          BugPokemon, NormalPokemon, PoisonPokemon, PsychicPokemon,
          GroundPokemon, FairyPokemon, RockPokemon, IcePokemon,
          DragonPokemon, DarkPokemon, SteelPokemon, GhostPokemon,
          FightingPokemon, FlyingPokemon
        };

        const PokemonClass = PokemonClasses[pokemon.class_type];
        if (!PokemonClass) {
          throw new Error(`Unknown class type: ${pokemon.class_type}`);
        }

        this._allPokemons.push(
          new PokemonClass(
            index + 1,
            pokemon.name,
            imagePath,
            pokemon.points,
            pokemon.special_power
          )
        );
      });
      this.isLoaded = true; // Marquem com a carregat
      console.log("Pokémon carregats correctament:", this._allPokemons.length);
    } catch (error) {
      console.error("Error carregant Pokémon:", error);
      this.isLoaded = false;
    }
  }
  sortPokemons(criteria, method) {
    if (!this.isLoaded || this._allPokemons.length === 0) {
      console.error("❌ No tinc pokemons a la llista.");
    } else {
      if (criteria == "name" || criteria == "points" || criteria == "type") {
        if (
          method == "bubble" ||
          method == "insertion" ||
          method == "selection"
        ) {
          //tot Ok. Comencem a ordenar
          console.log(
            `✅ Ordenat per '${criteria}' amb el mètode '${method}'.`
          );
          let len = this._allPokemons.length;
          switch (method) {
            case "bubble":
              switch (criteria) {
                case "name":
                  for (let i = 0; i < len - 1; i++) {
                    for (let j = 0; j < len - 1 - i; j++) {
                      if (
                        this._allPokemons[j].name >
                        this._allPokemons[j + 1].name
                      ) {
                        // Intercanviem els elements si estan fora d'ordre
                        let temp = this._allPokemons[j];
                        this._allPokemons[j] = this._allPokemons[j + 1];
                        this._allPokemons[j + 1] = temp;
                      }
                    }
                  }
                  break;
                case "points":
                  for (let i = 0; i < len - 1; i++) {
                    for (let j = 0; j < len - i - 1; j++) {
                      if (
                        this._allPokemons[j].points >
                        this._allPokemons[j + 1].points
                      ) {
                        [this._allPokemons[j], this._allPokemons[j + 1]] = [
                          this._allPokemons[j + 1],
                          this._allPokemons[j],
                        ];
                      }
                    }
                  }

                  break;
                case "type":
                  for (let i = 0; i < len - 1; i++) {
                    for (let j = 0; j < len - i - 1; j++) {
                      if (
                        this._allPokemons[j].constructor.name >
                        this._allPokemons[j + 1].constructor.name
                      ) {
                        [this._allPokemons[j], this._allPokemons[j + 1]] = [
                          this._allPokemons[j + 1],
                          this._allPokemons[j],
                        ];
                      }
                    }
                  }
                  break;
              }
              break;
            case "insertion":
              switch (criteria) {
                case "name":
                  for (let i = 1; i < len; i++) {
                    let key = this._allPokemons[i]; // Copia l'objecte complet
                    let j = i - 1;
                    while (j >= 0 && this._allPokemons[j].name > key.name) {
                      this._allPokemons[j + 1] = this._allPokemons[j];
                      j--;
                    }
                    this._allPokemons[j + 1] = key; // Reinsereix l'objecte complet
                  }

                  break;
                case "points":
                  for (let i = 1; i < len; i++) {
                    let key = this._allPokemons[i]; // Copia l'objecte complet
                    let j = i - 1;
                    while (j >= 0 && this._allPokemons[j].points > key.points) {
                      this._allPokemons[j + 1] = this._allPokemons[j];
                      j--;
                    }
                    this._allPokemons[j + 1] = key; // Reinsereix l'objecte complet
                  }
                  break;
                case "type":
                  for (let i = 1; i < len; i++) {
                    let key = this._allPokemons[i]; // Copia l'objecte complet
                    let j = i - 1;
                    while (
                      j >= 0 &&
                      this._allPokemons[j].constructor.name >
                        key.constructor.name
                    ) {
                      this._allPokemons[j + 1] = this._allPokemons[j];
                      j--;
                    }
                    this._allPokemons[j + 1] = key; // Reinsereix l'objecte complet
                  }

                  break;
              }
              break;
            case "selection":
              switch (criteria) {
                case "name":
                  for (let i = 0; i < len - 1; i++) {
                    let minIndex = i; // Suposem que el mínim és el primer element no ordenat
                    for (let j = i + 1; j < len; j++) {
                      if (
                        this._allPokemons[j].name <
                        this._allPokemons[minIndex].name
                      ) {
                        minIndex = j; // Actualitzem l'índex del mínim si trobem un element més petit
                      }
                    }
                    // Intercanviar l'element actual amb el mínim trobat
                    if (minIndex !== i) {
                      let temp = this._allPokemons[i];
                      this._allPokemons[i] = this._allPokemons[minIndex];
                      this._allPokemons[minIndex] = temp;
                    }
                  }

                  break;
                case "points":
                  for (let i = 0; i < len - 1; i++) {
                    let minIndex = i; // Suposem que el mínim és el primer element no ordenat
                    for (let j = i + 1; j < len; j++) {
                      if (
                        this._allPokemons[j].points <
                        this._allPokemons[minIndex].points
                      ) {
                        minIndex = j; // Actualitzem l'índex del mínim si trobem un element més petit
                      }
                    }
                    // Intercanviar l'element actual amb el mínim trobat
                    if (minIndex !== i) {
                      let temp = this._allPokemons[i];
                      this._allPokemons[i] = this._allPokemons[minIndex];
                      this._allPokemons[minIndex] = temp;
                    }
                  }

                  break;
                case "type":
                  for (let i = 0; i < len - 1; i++) {
                    let minIndex = i; // Assume the current index has the minimum type
                    for (let j = i + 1; j < len; j++) {
                      // Compare the types (constructor names) alphabetically
                      if (
                        this._allPokemons[j].constructor.name <
                        this._allPokemons[minIndex].constructor.name
                      ) {
                        minIndex = j; // Update the minimum index if a smaller type is found
                      }
                    }
                    // Swap the current element with the minimum element found
                    if (minIndex !== i) {
                      let temp = this._allPokemons[i];
                      this._allPokemons[i] = this._allPokemons[minIndex];
                      this._allPokemons[minIndex] = temp;
                    }
                  }
                  break;
              }
              break;
          }
        } else {
          console.error(
            `❌ El mètode d'ordenació '${method}' no és vàlid. Tria 'bubble', 'insertion' o 'selection'.`
          );
        }
      } else {
        console.error(
          `❌ El criteri d'ordenació '${criteria}' no és vàlid. Tria 'name', 'points' o 'type'.`
        );
      }
    }
  }

  getPokemonByName(name) {
    for (let i = 0; i < this._allPokemons.length; i++) {
      if (this._allPokemons[i].name == name) {
        return this._allPokemons[i];
      }
    }
  }
}

// =========================
// Classe: PokemonTeam
// =========================
export class PokemonTeam {
  constructor(credits = MAX_CREDITS, maxTeamSize = MAX_TEAM_SIZE) {
    this.selectedTeam = [];
    this.credits = credits;
    this.maxTeamSize = maxTeamSize; // New property for max team size
  }

  addPokemon(pokemon) {
    if (this.selectedTeam.length >= this.maxTeamSize) {
      console.warn(`Cannot add ${pokemon.name}. Team is already full.`);
      return false;
    }

    if (this.credits < pokemon.points) {
      console.warn(`Cannot add ${pokemon.name}. Not enough credits.`);
      return false;
    }

    const oldPokemon =
      this.selectedTeam.find(
        (oldPokemon) => oldPokemon.name === pokemon.name
      ) || null;
    if (!oldPokemon) {
      this.selectedTeam.push(pokemon);
      this.credits -= pokemon.points;
      return true;
    } else {
      console.warn(`Pokemon ${pokemon.name} was already in the team.`);
      return false;
    }
  }

  removePokemon(pokemonName) {
    const index = this.selectedTeam.findIndex((p) => p.name === pokemonName);
    if (index !== -1) {
      let damageMade = this.selectedTeam[index].special_power;
      this.credits += this.selectedTeam[index].points;
      this.selectedTeam.splice(index, 1);
      return damageMade;
    }
  }

  getTeamDetails() {
    return this.selectedTeam
      .map((pokemon) => pokemon.displayDetails())
      .join("\n");
  }
  getTeam(){
    return this.selectedTeam;
  }
  getCredits() {
    return this.credits;
  }
  decreaseSpecialPower(winnerName, pointsToDecrease) {
    const winner = this.selectedTeam.find(
      (pokemon) => pokemon.name === winnerName
    );

    if (!winner) {
      return `El Pokémon ${winnerName} no s'ha trobat en l'equip.`;
    }

    // Reduce special power
    winner.special_power -= pointsToDecrease;

    // Check if the Pokémon has "died"
    if (winner.special_power <= 0) {
      this.removePokemon(winnerName);
      return `☠️ ${winnerName} ha perdut tot el seu poder especial i s'ha eliminat de l'equip!`;
    }
    return `✅ ${winnerName} sobreviu amb un special power de: ${winner.special_power} punts.`;
  }
  getWhoIsFighting(){
    let fightingPokemon=null;
    this.selectedTeam.forEach((pokemon) => {
      if(pokemon.isFighting){
        fightingPokemon=pokemon;
      }
    });
    return fightingPokemon;
  }
  nobodyFights(){
    this.selectedTeam.forEach((pokemon) =>{
      pokemon.doesntFight();
    });
  }
}

// Merged Player class definition
export class Player {
  constructor(name) {
    this.name = name;
    this.team = new PokemonTeam(); // Instance of PokemonTeam to manage the player's team
  }

  // Returns the player's name
  getName() {
    return this.name;
  }

  // Adds a Pokémon to the player's team
  addPokemon(pokemon) {
    return this.team.addPokemon(pokemon);
  }

  // Removes a Pokémon from the player's team
  removePokemon(pokemonName) {
    return this.team.removePokemon(pokemonName);
  }

  // Returns the player's team details
  getTeamDetails() {
    return this.team.getTeamDetails();
  }
  getTeam(){
    return this.team.getTeam();
  }
  // Returns the player's remaining credits
  getCredits() {
    return this.team.getCredits();
  }

  // Handles attacking another player during the battle
  attack(target) {
    if (!this.team.hasAvailablePokemon()) {
      console.log(`${this.name} has no available Pokémon to attack.`);
      return;
    }

    const attackingPokemon = this.team.getNextPokemon();
    const defendingPokemon = target.team.getNextPokemon();

    if (attackingPokemon && defendingPokemon) {
      console.log(
        `${this.name}'s ${
          attackingPokemon.name
        } attacks ${target.getName()}'s ${defendingPokemon.name}!`
      );
      attackingPokemon.attack(defendingPokemon);

      if (defendingPokemon.isFainted()) {
        console.log(
          `${target.getName()}'s ${defendingPokemon.name} has fainted!`
        );
        target.team.removeFaintedPokemon(defendingPokemon);
      }
    } else {
      console.log("No valid Pokémon for the battle.");
    }
  }
  getWhoIsFighting(){
    return this.team.getWhoIsFighting();
  }
}
