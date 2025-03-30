import { Routes } from '@angular/router';
import { PokemonOverviewComponent } from './pages/pokemon-overview/pokemon-overview.component';
import { PokemonBuyComponent } from './pages/pokemon-buy/pokemon-buy.component';
import { PortfolioComponent } from './pages/portfolio/portfolio.component';

export const routes: Routes = [
  {
    path: 'pokemon/:pokemonKey/overview',
    component: PokemonOverviewComponent,
  },
  {
    path: 'pokemon/:pokemonKey/buy',
    component: PokemonBuyComponent,
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
  },
];
