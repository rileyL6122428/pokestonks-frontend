import { Component, effect, input, signal } from '@angular/core';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import { PokemonService } from '../../shared/services/pokemon.service';
import { PendingTransactionComponent } from '../pending-transaction/pending-transaction.component';
import { PokemonPositionComponent } from '../pokemon-position/pokemon-position.component';
import { Pokemon } from '../../shared/model/pokemon';

@Component({
  selector: 'app-pokemon-metrics',
  imports: [
    LoaderComponent,
    PokeDollarsComponent,
    PendingTransactionComponent,
    PokemonPositionComponent,
  ],
  templateUrl: './pokemon-metrics.component.html',
  styleUrl: './pokemon-metrics.component.scss',
})
export class PokemonMetricsComponent {
  pokemonKey = input<string>('');

  pokemon = signal<Pokemon>(new Pokemon());
  isloading = signal(true);

  constructor(private pokemonService: PokemonService) {
    effect(() => {
      this.isloading.set(true);
      this.pokemonService.getPokemon({ key: this.pokemonKey() }).subscribe((pokemon) => {
        this.pokemon.set(pokemon);
        this.isloading.set(false);
      });
    });
  }

  get portraitUrl() {
    return `poke/${this.pokemon().number}/${this.pokemon().form}/portrait.png`;
  }

  get imageAlt(): string {
    return `Portrait of ${this.pokemon().name}`;
  }
}
