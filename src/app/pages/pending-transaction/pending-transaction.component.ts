import { TitleCasePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Router } from '@angular/router';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import { Pokemon } from '../../shared/model/pokemon';
import { StockTransaction } from '../../shared/model/stock-transaction';

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
  canSell = input(false);
  canBuy = input(false);

  cancelTransaction = output();

  constructor(private router: Router) {}

  gotoBuy() {
    this.router.navigateByUrl(`/pokemon/${this.pokemon().key}/buy`);
  }

  gotoSell() {
    console.log(`Ask started for ${this.pokemon().name}`);
  }

  get pendingTransactionType(): string {
    let type = '';
    if (this.pendingTransaction()?.isAsk) {
      type = 'ask';
    } else if (this.pendingTransaction()?.isAsk) {
      type = 'bid';
    }
    return type;
  }
}
