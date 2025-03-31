import { Component, Input, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { zip } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import {
  PokedexModalComponent,
  PokedexModalResult,
} from '../../shared/components/pokedex-modal/pokedex-modal.component';
import { PokemonService } from '../../shared/services/pokemon.service';
import { TransactionService } from '../../shared/services/transaction.service';
import { UserService } from '../../shared/services/user.service';
import { StockTransaction } from '../../shared/model/stock-transaction';
import { Pokemon } from '../../shared/model/pokemon';

export type SortBy = 'sharePriceDesc' | 'shareVolumeDesc' | 'shareVolumeAsc';

@Component({
  selector: 'app-pokemon-buy',
  imports: [
    PokeDollarsComponent,
    FormsModule,
    LoaderComponent,
    PokedexModalComponent,
  ],
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
    this.loadPage(key);
    // this.loading.set(true);
    // if (!key) {
    //   return;
    // }
    // this.pokemonService.getPokemon({ key }).subscribe((pokemon) => {
    //   this.pokemon.set(pokemon);
    // });

    // zip(
    //   this.transactionService.getAsksForPokemon({ pokemonKey: key }),
    //   this.userService.getCurrentUser(),
    // ).subscribe(([asks, currentUser]) => {
    //   const filteredAsks = asks.filter(
    //     (ask) => ask.sellerUsername !== currentUser.username,
    //   );
    //   this.asks.set(filteredAsks);
    //   this.sortAsks();
    //   this.loading.set(false);
    // });
  }

  loadPage(key: string | undefined) {
    this.loading.set(true);
    if (!key) {
      return;
    }
    this.pokemonService.getPokemon({ key }).subscribe((pokemon) => {
      this.pokemon.set(pokemon);
    });

    zip(
      this.transactionService.getAsksForPokemon({ pokemonKey: key }),
      this.userService.getCurrentUser(),
    ).subscribe(([asks, currentUser]) => {
      const filteredAsks = asks.filter(
        (ask) => ask.sellerUsername !== currentUser.username,
      );
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
    const selectedAsk = this.selectedAsk();
    if (!selectedAsk) {
      return;
    }

    this.buyResult.set('inProgress');
    this.transactionService
      .acceptAsk({
        pokemonKey: this.pokemon().key,
        askOwnerUsername: selectedAsk.sellerUsername,
      })
      .subscribe((result) => {
        if (result) {
          this.buyResult.set('successful');
        } else {
          this.buyResult.set('failed');
        }
      });
    // setTimeout(() => {
    //   // this.buyResult.set('successful');
    //   this.buyResult.set('failed');
    // }, 3500);
  }

  onSuccessAnimationComplete() {
    this.buyResult.set('notStarted');
    this.selectedAsk.set(null);
    this.loadPage(this.pokemon().key);
  }
}
