import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { BehaviorSubject, debounceTime, mergeMap, Subscription } from 'rxjs';
import { Pokemon, PokemonService } from './shared/services/pokemon.service';
import { UserService } from './shared/services/user.service';
import { User } from './shared/model/user';

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
  currentUser = signal<User>(new User({ username: '' }));

  constructor(
    private pokemonService: PokemonService,
    private userService: UserService,
  ) {}

  ngOnInit() {
    this.searchSub = this.searchUpdate
      .pipe(
        debounceTime(300),
        mergeMap((searchText) => this.pokemonService.searchPokemon(searchText)),
      )
      .subscribe((searchResults) => this.searchResults.set(searchResults));

    this.userService.getCurrentUser().subscribe((currentUser) => {
      this.currentUser.set(currentUser);
    });
  }

  onSearchChange(searchText: string) {
    this.searchUpdate.next(searchText);
  }

  ngOnDestroy() {
    this.searchSub.unsubscribe();
  }
}
