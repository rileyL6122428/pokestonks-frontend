import { Component, Input, signal } from '@angular/core';
import { delay } from 'rxjs';
import { Pokemon, PokemonService } from '../pokemon.service';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../shared/components/poke-dollars/poke-dollars.component';

@Component({
  selector: 'app-pokemon-metrics',
  imports: [LoaderComponent, PokeDollarsComponent],
  templateUrl: './pokemon-metrics.component.html',
  styleUrl: './pokemon-metrics.component.scss',
})
export class PokemonMetricsComponent {
  pokemon = signal<Pokemon>(new Pokemon());

  isloading = signal(true);

  constructor(private pokemonService: PokemonService) {}

  get portraitUrl() {
    return `poke/${this.pokemon().number}/${this.pokemon().form}/portrait.png`;
  }

  @Input()
  set pokemonKey(key: string) {
    this.isloading.set(true);
    this.pokemonService
      .getPokemon({ key })
      .pipe(delay(2000))
      .subscribe((pokemon) => {
        this.pokemon.set(pokemon);
        this.isloading.set(false);
      });
  }

  get imageAlt(): string {
    return `Portrait of ${this.pokemon().name}`;
  }
}
