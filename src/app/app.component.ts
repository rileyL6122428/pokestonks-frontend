import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BehaviorSubject, debounceTime, mergeMap, Subscription } from 'rxjs';
import { Pokemon, PokemonService } from './pokemon.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'pokestonks-frontend';

  searchUpdate = new BehaviorSubject<string>('');
  private searchSub: Subscription = new Subscription();
  searchResults = signal<Pokemon[]>([]);

  constructor(private pokemonService: PokemonService) {}

  ngOnInit() {
    this.searchSub = this.searchUpdate
      .pipe(
        debounceTime(300),
        mergeMap((searchText) => this.pokemonService.searchPokemon(searchText)),
      )
      .subscribe((searchResults) => this.searchResults.set(searchResults));
  }

  onSearchChange(searchText: string) {
    this.searchUpdate.next(searchText);
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }
}
