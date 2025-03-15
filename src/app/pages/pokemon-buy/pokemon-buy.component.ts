import { Component, Input, OnInit, signal } from '@angular/core';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import { FormsModule } from '@angular/forms';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { Pokemon, PokemonService } from '../../shared/services/pokemon.service';
import { StockTransaction, TransactionService } from '../../shared/services/transaction.service';
import { UserService } from '../../shared/services/user.service';
import { zip } from 'rxjs';
import { NgClass } from '@angular/common';
import {
  PokedexModalComponent,
  PokedexModalResult,
} from '../../shared/components/pokedex-modal/pokedex-modal.component';

export type SortBy = 'sharePriceDesc' | 'shareVolumeDesc' | 'shareVolumeAsc';

@Component({
  selector: 'app-pokemon-buy',
  imports: [PokeDollarsComponent, FormsModule, LoaderComponent, NgClass, PokedexModalComponent],
  templateUrl: './pokemon-buy.component.html',
  styleUrl: './pokemon-buy.component.scss',
})
export class PokemonBuyComponent {
  pokemon = signal<Pokemon>(new Pokemon());
  loading = signal(true);
  asks = signal<StockTransaction[]>([]);
  sortBy: SortBy = 'sharePriceDesc';
  selectedAsk = signal<StockTransaction | null>(null);
  buyConfirmed = signal(false);

  buyResult = signal<PokedexModalResult>('notStarted');

  constructor(
    private pokemonService: PokemonService,
    private transactionService: TransactionService,
    private userService: UserService,
  ) {}

  @Input()
  set pokemonKey(key: string | undefined) {
    this.loading.set(true);
    if (!key) {
      return;
    }
    this.pokemonService.getPokemon({ key }).subscribe((pokemon) => {
      this.pokemon.set(pokemon);
    });

    zip(
      this.transactionService.getTransactionsForPokemon({
        pokemonKey: key,
        type: 'ask',
        status: 'pending',
      }),
      this.userService.getCurrentUser(),
    ).subscribe(([asks, currentUser]) => {
      const filteredAsks = asks.filter((ask) => ask.ownerUsername !== currentUser.username);
      this.asks.set(filteredAsks);
      this.sortAsks();
      this.loading.set(false);
    });
  }

  sortAsks() {
    const asks = this.asks();
    asks.sort((a, b) => {
      if (this.sortBy === 'sharePriceDesc') {
        return b.sharePricePokeDollars - a.sharePricePokeDollars;
      } else if (this.sortBy === 'shareVolumeDesc') {
        return b.shareCount - a.shareCount;
      } else if (this.sortBy === 'shareVolumeAsc') {
        return a.shareCount - b.shareCount;
      }
      return 0;
    });
    this.asks.set(asks);
  }

  buySelected() {
    this.buyResult.set('inProgress');
    setTimeout(() => {
      this.buyResult.set('successful');
    }, 3500);
  }
}
