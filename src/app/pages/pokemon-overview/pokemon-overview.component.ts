import { Component, effect, input, signal } from '@angular/core';
import { mergeMap, tap } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import { Pokemon } from '../../shared/model/pokemon';
import { PokemonOverview } from '../../shared/model/pokemon-overview';
import { User } from '../../shared/model/user';
import { PokemonOverviewService } from '../../shared/services/pokemon-overview.service';
import { UserService } from '../../shared/services/user.service';
import { PendingTransactionComponent } from '../pending-transaction/pending-transaction.component';
import { PokemonPositionComponent } from '../pokemon-position/pokemon-position.component';
import { StockTransaction } from '../../shared/model/stock-transaction';
import { TransactionService } from '../../shared/services/transaction.service';

@Component({
  selector: 'app-pokemon-overview',
  imports: [
    LoaderComponent,
    PokeDollarsComponent,
    PendingTransactionComponent,
    PokemonPositionComponent,
  ],
  templateUrl: './pokemon-overview.component.html',
  styleUrl: './pokemon-overview.component.scss',
})
export class PokemonOverviewComponent {
  pokemonKey = input<string>('');
  user = signal<User>(new User({ username: '' }));

  isloading = signal(true);
  pokemon = signal<Pokemon>(new Pokemon());
  lastTransaction = signal<StockTransaction | null>(null);
  lowestAsk = signal<StockTransaction | null>(null);
  highestBid = signal<StockTransaction | null>(null);
  availableShares = signal<number | null>(null);

  pendingTransaction = signal<StockTransaction | null>(null);
  isLoadingPendingTransaction = signal(true);

  constructor(
    private overviewService: PokemonOverviewService,
    private userService: UserService,
    private transactionService: TransactionService,
  ) {
    effect(() => {
      const pokemonKey = this.pokemonKey();

      this.isloading.set(true);
      this.isLoadingPendingTransaction.set(true);
      this.userService
        .getCurrentUser()
        .pipe(
          tap((user) => this.user.set(user)),
          mergeMap(() => {
            return this.overviewService.getPokemonOverviewForUser({
              ownerUsername: this.user().username,
              pokemonKey,
            });
          }),
        )
        .subscribe((overview: PokemonOverview) => {
          this.pokemon.set(overview.pokemon);
          this.lastTransaction.set(overview.lastTransaction);
          this.lowestAsk.set(overview.lowestAsk);
          this.highestBid.set(overview.highestBid);
          this.availableShares.set(overview.availableShares);

          this.pendingTransaction.set(overview.pendingTransaction);
          this.isLoadingPendingTransaction.set(false);

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

  get marketCap(): number {
    if (this.pokemon() && this.lastTransaction()) {
      return this.pokemon().marketCap(
        this.lastTransaction()!.sharePricePokeDollars,
      );
    } else {
      return 0;
    }
  }

  cancelTransaction() {
    if (!this.pendingTransaction()) {
      return;
    }

    this.isLoadingPendingTransaction.set(true);
    this.transactionService
      .cancelTransaction(this.pendingTransaction()!)
      .subscribe({
        next: (wasSuccessful) => {
          if (wasSuccessful) {
            this.pendingTransaction.set(null);
          }
        },
        complete: () => {
          this.isLoadingPendingTransaction.set(false);
        },
      });
  }
}
