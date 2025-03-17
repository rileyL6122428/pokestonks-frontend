import { NgClass } from '@angular/common';
import { Component, Input, input, output, signal } from '@angular/core';

export type PokedexModalResult = 'successful' | 'failed' | 'inProgress' | 'notStarted';

@Component({
  selector: 'app-pokedex-modal',
  imports: [NgClass],
  templateUrl: './pokedex-modal.component.html',
  styleUrl: './pokedex-modal.component.scss',
})
export class PokedexModalComponent {
  _result = signal<PokedexModalResult>('notStarted');
  private inProgressStartTime: number | null = null;

  @Input()
  set result(result: PokedexModalResult) {
    if (result === 'notStarted') {
      this.inProgressStartTime = null;
      this._result.set(result);
    } else if (result === 'inProgress') {
      this.inProgressStartTime = Date.now();
      this._result.set(result);
    } else {
      // Add a delay to the result to line up the animation, which runs a full cycle every 1 second
      const timeElapsed = this.inProgressStartTime ? Date.now() - this.inProgressStartTime : 0;
      const waitTime = (timeElapsed % 1000) + (timeElapsed < 2000 ? 1000 : 0) - 2;
      setTimeout(() => this._result.set(result), waitTime);
    }
  }

  get renderPokeball() {
    return this._result() === 'successful' || this._result() === 'inProgress';
  }

  get animatePokeballShake() {
    return this._result() === 'inProgress';
  }

  get animatePokemonCaught() {
    return this._result() === 'successful';
  }

  get animatePokemonEscape() {
    return this._result() === 'failed';
  }
}
