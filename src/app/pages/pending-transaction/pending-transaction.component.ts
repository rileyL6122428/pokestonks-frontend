import { Component, Input, signal } from '@angular/core';
import { StockTransaction, TransactionService } from '../../shared/services/transaction.service';
import { Pokemon, PokemonService } from '../../shared/services/pokemon.service';
import { User, UserService } from '../../shared/services/user.service';
import { mergeMap, zip } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-pending-transaction',
  imports: [LoaderComponent, PokeDollarsComponent, TitleCasePipe],
  templateUrl: './pending-transaction.component.html',
  styleUrl: './pending-transaction.component.scss',
})
export class PendingTransactionComponent {
  pokemon = signal<Pokemon>(new Pokemon());

  pendingTransaction = signal<StockTransaction | null>(null);

  isloading = signal(true);

  constructor(
    private pokemonService: PokemonService,
    private userService: UserService,
    private transactionService: TransactionService,
  ) {}

  @Input()
  set pokemonKey(key: string | undefined) {
    if (!key) {
      return;
    }

    this.isloading.set(true);
    const pokemon$ = this.pokemonService.getPokemon({ key });
    const user$ = this.userService.getCurrentUser();
    const transaction$ = user$.pipe(
      mergeMap((user: User) =>
        this.transactionService.getTransactions(user.username, key, 'pending'),
      ),
    );

    zip(pokemon$, transaction$).subscribe(([pokemon, transactions]) => {
      this.pokemon.set(pokemon);
      this.pendingTransaction.set(transactions[0] ?? null);
      this.isloading.set(false);
    });
  }

  startBid() {
    console.log(`Bid started for ${this.pokemon().name}`);
  }

  cancelTransaction() {
    const transaction = this.pendingTransaction();
    if (!transaction) {
      return;
    }

    this.isloading.set(true);
    this.transactionService.cancelTransaction(transaction).subscribe({
      next: (wasSuccessful) => {
        if (wasSuccessful) {
          this.pendingTransaction.set(null);
        }
      },
      complete: () => {
        this.isloading.set(false);
      },
    });
  }

  startAsk() {
    console.log(`Ask started for ${this.pokemon().name}`);
  }
}
