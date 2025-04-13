import { createApp } from 'vue'
import App from './App.vue'
import { PokemonTeamViewModel } from "./viewmodels/viewModel.js";

// Correct path to JSON file
const viewModel = new PokemonTeamViewModel('/src/assets/pokemon_data.json');

document.addEventListener("DOMContentLoaded", () => {
    console.log('Initializing Pokemon Game...');
    
    const app = createApp(App);
    app.provide('viewModel', viewModel);
    app.mount('#app');
    
    console.log('Pokemon Game initialized successfully');
});
