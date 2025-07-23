import { IDL, Principal, query, update } from 'azle';

export class Auth {
    private currentUser: Principal | null = null;

    @query([], IDL.Principal)
    getCurrentUser(): Principal {
        if (!this.currentUser) {
            throw new Error('Not authenticated');
        }
        return this.currentUser;
    }

    @update([], IDL.Bool)
    isAuthenticated(): boolean {
        return this.currentUser !== null;
    }

    @update([IDL.Principal], IDL.Bool)
    login(principal: Principal): boolean {
        this.currentUser = principal;
        return true;
    }

    @update([], IDL.Bool)
    logout(): boolean {
        this.currentUser = null;
        return true;
    }

    @query([], IDL.Text)
    whoAmI(): string {
        return this.isAuthenticated() 
            ? this.currentUser!.toString()
            : 'Anonymous';
    }
}

export const authInstance = new Auth();