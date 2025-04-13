# Pokémon Battle Game con Vue 3 + Vite

## Descripció
Adaptació del projecte Pokémon a Vue.js utilitzant Vite com a bundler. El joc permet crear equips de Pokémon i fer-los lluitar entre ells.

## Avantatges de Vite + Vue vs Vue CDN

1. **Millor Rendiment**
   - Hot Module Replacement (HMR)
   - Compilació més ràpida
   - Càrrega de mòduls sota demanda

2. **Desenvolupament Modern**
   - Suport natiu per TypeScript
   - Sistema de mòduls ES
   - Eines de desenvolupament integrades

3. **Producció Optimitzada**
   - Bundling automàtic
   - Tree-shaking
   - Minificació de codi

4. **Millor Organització**
   - Estructura de projecte clara
   - Components modulars
   - Gestió de dependències professional

## Estructura del Projecte
```
src/
  ├── components/    # Components Vue reutilitzables
  ├── models/       # Classes del model de dades
  ├── viewmodels/   # Lògica de negoci i estat
  ├── assets/       # Recursos estàtics
  └── App.vue       # Component principal
```

## Característiques Principals
- Selecció d'equips Pokémon
- Sistema de batalla automàtica
- Ordenació de Pokémon per diferents criteris
- Mode 2 jugadors i mode vs CPU
