import { Component, input } from '@angular/core';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import { Position } from '../../shared/model/position';
import { StockTransaction } from '../../shared/model/stock-transaction';

@Component({
  selector: 'app-pokemon-position',
  imports: [PokeDollarsComponent, PokeDollarsComponent, LoaderComponent],
  templateUrl: './pokemon-position.component.html',
  styleUrl: './pokemon-position.component.scss',
})
export class PokemonPositionComponent {
  loading = input(true);
  position = input<Position | null>(null);
  lastTransaction = input<StockTransaction | null>(null);

  get valuation(): number | null {
    if (this.position() === null || this.lastTransaction() === null) {
      return null;
    }

    return (
      this.position()!.ownedSharesCount *
      this.lastTransaction()!.sharePricePokeDollars
    );
  }
}
