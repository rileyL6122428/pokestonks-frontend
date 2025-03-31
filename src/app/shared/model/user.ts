export class User {
  username: string;
  freeCashPokeDollars: number;
  constructor(params: UserParams) {
    this.username = params.username;
    this.freeCashPokeDollars = params.freeCashPokeDollars;
  }
}

export interface UserParams {
  username: string;
  freeCashPokeDollars: number;
}
