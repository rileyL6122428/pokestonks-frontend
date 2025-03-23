import { Component, effect, input, Input, output, signal } from '@angular/core';
import { TransactionService } from '../../shared/services/transaction.service';
import { PokemonService } from '../../shared/services/pokemon.service';
import { UserService } from '../../shared/services/user.service';
import { mergeMap, zip } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import { TitleCasePipe } from '@angular/common';
import { Router } from '@angular/router';
import { StockTransaction } from '../../shared/model/stock-transaction';
import { User } from '../../shared/model/user';
import { Pokemon } from '../../shared/model/pokemon';

@Component({
  selector: 'app-pending-transaction',
  imports: [LoaderComponent, PokeDollarsComponent, TitleCasePipe],
  templateUrl: './pending-transaction.component.html',
  styleUrl: './pending-transaction.component.scss',
})
export class PendingTransactionComponent {
  pokemon = input<Pokemon>(new Pokemon());
  pendingTransaction = input<StockTransaction | null>(null);
  isloading = input(true);

  cancelTransaction = output();

  constructor(
    private pokemonService: PokemonService,
    private userService: UserService,
    private transactionService: TransactionService,
    private router: Router,
  ) {}

  // @Input()
  // set pokemonKey(key: string | undefined) {
  //   if (!key) {
  //     return;
  //   }

  //   this.isloading.set(true);
  //   const pokemon$ = this.pokemonService.getPokemon({ key });
  //   const user$ = this.userService.getCurrentUser();
  //   const transaction$ = user$.pipe(
  //     mergeMap((user: User) =>
  //       this.transactionService.getTransactionsForOwnerByPokemon(
  //         user.username,
  //         key,
  //         'pending',
  //       ),
  //     ),
  //   );

  //   zip(pokemon$, transaction$).subscribe(([pokemon, transactions]) => {
  //     this.pokemon.set(pokemon);
  //     this.pendingTransaction.set(transactions[0] ?? null);
  //     this.isloading.set(false);
  //   });
  // }

  gotoBuy() {
    this.router.navigateByUrl(`/pokemon/${this.pokemon().key}/buy`);
  }

  // cancelTransaction() {
  //   const transaction = this.pendingTransaction();
  //   if (!transaction) {
  //     return;
  //   }

  //   this.isloading.set(true);
  //   this.transactionService.cancelTransaction(transaction).subscribe({
  //     next: (wasSuccessful) => {
  //       if (wasSuccessful) {
  //         this.pendingTransaction.set(null);
  //       }
  //     },
  //     complete: () => {
  //       this.isloading.set(false);
  //     },
  //   });
  // }

  gotoSell() {
    console.log(`Ask started for ${this.pokemon().name}`);
  }
}
