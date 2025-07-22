import { query, update } from 'azle';
import { logout, getCurrentUser } from './auth';

export default class {
  @query([])
  whoAmI(): string {
    return getCurrentUser().toString();
  }

  @update()
  login(): string {
    const principal = getCurrentUser();
    return `Login successful. Principal: ${principal.toString()}`;
  }

  @update()
  logout(): string {
    logout();
    return "Logged out successfully";
  }
}
