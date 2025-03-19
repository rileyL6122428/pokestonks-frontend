export class Pokemon {
  number: number;
  form: string;
  name: string;
  slogan: string;
  operatingMarginPercent: number;
  totalShares: number;
  availableShares: number;
  bidPokeDollars: number;
  askPokeDollars: number;
  lastTradePokeDollars: number;

  constructor(
    params: PokemonParams = {
      number: 0,
      form: '',
      name: '...',
      slogan: '',
      operatingMarginPercent: 0,
      totalShares: 0,
      availableShares: 0,
      bidPokeDollars: 0,
      askPokeDollars: 0,
      lastTradePokeDollars: 0,
    },
  ) {
    this.number = params.number;
    this.form = params.form;
    this.name = params.name;
    this.slogan = params.slogan;
    this.operatingMarginPercent = params.operatingMarginPercent;
    this.totalShares = params.totalShares;
    this.availableShares = params.availableShares;
    this.bidPokeDollars = params.bidPokeDollars;
    this.askPokeDollars = params.askPokeDollars;
    this.lastTradePokeDollars = params.lastTradePokeDollars;
  }

  get marketCapPokeDollars() {
    return (this.totalShares - this.availableShares) * this.lastTradePokeDollars;
  }

  get key(): string {
    return `${this.number}-${this.form}`;
  }

  get areSharesAvailable(): boolean {
    return this.availableShares > 0;
  }
}

export interface PokemonParams {
  number: number;
  form: string;
  name: string;
  slogan: string;
  operatingMarginPercent: number;
  totalShares: number;
  availableShares: number;
  bidPokeDollars: number;
  askPokeDollars: number;
  lastTradePokeDollars: number;
}
