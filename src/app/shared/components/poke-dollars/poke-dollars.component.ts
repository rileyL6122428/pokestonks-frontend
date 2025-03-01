import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-poke-dollars',
  imports: [CurrencyPipe],
  templateUrl: './poke-dollars.component.html',
  styleUrl: './poke-dollars.component.scss',
})
export class PokeDollarsComponent {
  amount = input<number>(0);
}
