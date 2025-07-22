import { Principal } from '@dfinity/principal';

let currentUser: Principal | null = null;

export default function getAgentId(): Principal {
  return currentUser ?? Principal.anonymous();
}

export class Auth {
  login(principal: Principal): void {
    currentUser = principal;
  }

  logout(): void {
    currentUser = null;
  }

  getCurrentUser(): Principal {
    return currentUser ?? Principal.anonymous();
  }
}
