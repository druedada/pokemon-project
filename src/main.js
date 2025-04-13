import { createApp } from 'vue'
import App from './App.vue'
import { PokemonTeamViewModel } from "./viewmodels/viewModel.js";

const app = createApp(App);
const viewModel = new PokemonTeamViewModel();
app.provide('viewModel', viewModel);
app.mount('#app');
