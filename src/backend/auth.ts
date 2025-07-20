import { Principal } from '@dfinity/principal';

let currentUser: Principal | null = null;

export function login(principal: Principal): void {
  currentUser = principal;
}

export function logout(): void {
  currentUser = null;
}

export function getCurrentUser(): Principal {
  return currentUser || Principal.anonymous();
}
