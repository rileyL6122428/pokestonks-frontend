import { Component, OnInit, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { PokemonService, Pokemon } from '../pokemon.service';
import { delay } from 'rxjs';
import { LoaderComponent } from '../shared/components/loader/loader.component';

@Component({
  selector: 'app-pokemon-metrics',
  imports: [CurrencyPipe, LoaderComponent],
  templateUrl: './pokemon-metrics.component.html',
  styleUrl: './pokemon-metrics.component.scss',
})
export class PokemonMetricsComponent implements OnInit {
  pokemon = signal<Pokemon>({
    number: 0,
    form: '',
    name: '',
    slogan: '',
    operatingMarginPercent: 0,
    stockPricePokeDollars: 0,
    totalShares: 0,
    availableShares: 0,
    marketCapPokeDollars: 0,
  });

  isloading = signal(true);

  constructor(private pokemonService: PokemonService) {}

  ngOnInit(): void {
    this.pokemonService
      .getPokemon({
        number: 898,
        form: 'ice-rider',
      })
      .pipe(delay(2000))
      .subscribe((pokemon) => {
        this.pokemon.set(pokemon);
        this.isloading.set(false);
      });
  }

  get portraitUrl() {
    return `poke/${this.pokemon().number}/${this.pokemon().form}/portrait.png`;
  }
}
