import { Routes } from '@angular/router';
import { PokemonMetricsComponent } from './pages/pokemon-metrics/pokemon-metrics.component';
import { PokemonBuyComponent } from './pages/pokemon-buy/pokemon-buy.component';

export const routes: Routes = [
  {
    path: 'pokemon/:pokemonKey/metrics',
    component: PokemonMetricsComponent,
  },
  {
    path: 'pokemon/:pokemonKey/buy',
    component: PokemonBuyComponent,
  },
];
