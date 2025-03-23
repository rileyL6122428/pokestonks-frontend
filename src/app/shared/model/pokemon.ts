export class Pokemon {
  number: number;
  form: string;
  name: string;
  slogan: string;
  operatingMarginPercent: number;
  totalShares: number;

  constructor(
    params: PokemonParams = {
      number: 0,
      form: '',
      name: '...',
      slogan: '',
      operatingMarginPercent: 0,
      totalShares: 0,
    },
  ) {
    this.number = params.number;
    this.form = params.form;
    this.name = params.name;
    this.slogan = params.slogan;
    this.operatingMarginPercent = params.operatingMarginPercent;
    this.totalShares = params.totalShares;
  }

  get key(): string {
    return `${this.number}-${this.form}`;
  }

  marketCap(lastPrice: number): number {
    return lastPrice * this.totalShares;
  }
}

export interface PokemonParams {
  number: number;
  form: string;
  name: string;
  slogan: string;
  operatingMarginPercent: number;
  totalShares: number;
}
