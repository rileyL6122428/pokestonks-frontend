export class User {
  username: string;
  constructor(params: UserParams) {
    this.username = params.username;
  }
}

export interface UserParams {
  username: string;
}
