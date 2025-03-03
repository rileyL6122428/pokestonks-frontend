import { Routes } from '@angular/router';
import { PokemonMetricsComponent } from './pages/pokemon-metrics/pokemon-metrics.component';
import { CurrentTransactionComponent } from './pages/current-transaction/current-transaction.component';

export const routes: Routes = [
  {
    path: 'pokemon/:pokemonKey/metrics',
    component: PokemonMetricsComponent,
    children: [
      {
        path: '',
        component: CurrentTransactionComponent,
      },
    ],
  },
];
