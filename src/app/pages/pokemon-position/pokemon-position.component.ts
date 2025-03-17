import { Component, effect, input, signal } from '@angular/core';
import { PokeDollarsComponent } from '../../shared/components/poke-dollars/poke-dollars.component';
import { PortfolioService, Position } from '../../shared/services/portfolio.service';
import { UserService } from '../../shared/services/user.service';
import { map, mergeMap } from 'rxjs';
import { LoaderComponent } from '../../shared/components/loader/loader.component';

@Component({
  selector: 'app-pokemon-position',
  imports: [PokeDollarsComponent, PokeDollarsComponent, LoaderComponent],
  templateUrl: './pokemon-position.component.html',
  styleUrl: './pokemon-position.component.scss',
})
export class PokemonPositionComponent {
  pokemonKey = input<string>('');
  loading = signal(true);
  position = signal<Position | null>(null);

  constructor(
    private readonly portfolioService: PortfolioService,
    private readonly userService: UserService,
  ) {
    effect(() => {
      const pokemonKey = this.pokemonKey();
      this.loading.set(true);
      this.userService
        .getCurrentUser()
        .pipe(
          map((user) => user.username),
          mergeMap((username: string) => {
            console.log('Sup');
            return this.portfolioService.getPosition({ username, pokemonKey });
          }),
        )
        .subscribe((position: Position) => {
          console.log('SUP AGAIN');
          this.position.set(position);
          this.loading.set(false);
        });
    });
  }

  get valuation(): number {
    const position = this.position();
    return position ? position.ownedSharesCount * position.lastPrice : 0;
  }
}
