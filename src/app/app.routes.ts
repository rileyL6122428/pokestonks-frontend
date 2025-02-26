import { Routes } from '@angular/router';
import { PokemonMetricsComponent } from './pokemon-metrics/pokemon-metrics.component';

export const routes: Routes = [
  {
    path: 'pokemon/:pokemonNumber/:pokemonForm/metrics',
    component: PokemonMetricsComponent,
  },
];
