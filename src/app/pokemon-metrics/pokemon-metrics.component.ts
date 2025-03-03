import { Component, Input, signal } from '@angular/core';
import { Pokemon, PokemonService } from '../shared/services/pokemon.service';
import { LoaderComponent } from '../shared/components/loader/loader.component';
import { PokeDollarsComponent } from '../shared/components/poke-dollars/poke-dollars.component';
import { mergeMap, zip } from 'rxjs';
import { User, UserService } from '../shared/services/user.service';
import { Ask, Bid, TransactionService } from '../shared/services/transaction.service';

@Component({
  selector: 'app-pokemon-metrics',
  imports: [LoaderComponent, PokeDollarsComponent],
  templateUrl: './pokemon-metrics.component.html',
  styleUrl: './pokemon-metrics.component.scss',
})
export class PokemonMetricsComponent {
  pokemon = signal<Pokemon>(new Pokemon());

  bid = signal<Bid | null>(null);
  cancellingBid = signal(false);

  ask = signal<Ask | null>(null);
  cancellingAsk = signal(false);

  isloading = signal(true);

  constructor(
    private pokemonService: PokemonService,
    private userService: UserService,
    private transactionService: TransactionService,
  ) {}

  get portraitUrl() {
    return `poke/${this.pokemon().number}/${this.pokemon().form}/portrait.png`;
  }

  @Input()
  set pokemonKey(key: string) {
    this.isloading.set(true);
    const pokemon$ = this.pokemonService.getPokemon({ key });
    const user$ = this.userService.getCurrentUser();
    const bid$ = user$.pipe(
      mergeMap((user: User) => this.transactionService.getBid(user.username, key)),
    );
    const ask$ = user$.pipe(
      mergeMap((user: User) => this.transactionService.getAsk(user.username, key)),
    );

    zip(pokemon$, bid$, ask$).subscribe(([pokemon, bid, ask]) => {
      this.pokemon.set(pokemon);
      this.bid.set(bid);
      this.ask.set(ask);
      this.isloading.set(false);
    });
  }

  get imageAlt(): string {
    return `Portrait of ${this.pokemon().name}`;
  }

  startBid() {
    console.log(`Bid started for ${this.pokemon().name}`);
  }

  cancelBid() {
    const bid = this.bid();
    if (!bid) {
      return;
    }

    this.cancellingBid.set(true);
    this.transactionService.cancelBid(bid).subscribe({
      next: (wasSuccessful) => {
        if (wasSuccessful) {
          this.bid.set(null);
        }
      },
      complete: () => {
        this.cancellingBid.set(false);
      },
    });
  }

  startAsk() {
    console.log(`Ask started for ${this.pokemon().name}`);
  }

  cancelAsk() {
    const ask = this.ask();
    if (!ask) {
      return;
    }

    this.cancellingAsk.set(true);
    this.transactionService.cancelAsk(ask).subscribe({
      next: (wasSuccessful) => {
        if (wasSuccessful) {
          this.ask.set(null);
        }
      },
      complete: () => {
        this.cancellingAsk.set(false);
      },
    });
  }
}
