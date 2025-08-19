import { AuthClient } from '@dfinity/auth-client';
import { Principal } from '@dfinity/principal';
import { HttpAgent } from "@dfinity/agent";
import { createActor } from '../../../declarations/backend';
import { _SERVICE } from '../../../declarations/backend/backend.did';

let authClient: AuthClient;
let actor: _SERVICE | null = null;

export async function initAuthClient(): Promise<void> {
    authClient = await AuthClient.create();
}

async function initActor(): Promise<_SERVICE> {
    if (!authClient) {
        await initAuthClient();
    }

    const identity = authClient.getIdentity();

    const isLocal = process.env.DFX_NETWORK !== "ic";
    const host = isLocal ? "http://localhost:4943" : "https://ic0.app";

    const agent = new HttpAgent({
        identity,
        host
    });

    if (isLocal) {
        try {
            await agent.fetchRootKey();
        } catch (error) {
            console.warn("Unable to fetch root key. Check if the local replica is running.");
            throw new Error("Local replica not accessible. Please run 'dfx start'");
        }
    }

    const backendCanisterId = process.env.CANISTER_ID_BACKEND;
    if (!backendCanisterId) {
        throw new Error("CANISTER_ID_BACKEND environment variable is not set");
    }

    try {
        actor = createActor(backendCanisterId, {
            agent,
        });

        return actor;
    } catch (error) {
        console.error("Failed to create actor:", error);
        throw new Error("Failed to create backend actor. Check if backend canister is deployed.");
    }
}

export async function login(): Promise<string> {
    return new Promise((resolve, reject) => {
        authClient.login({
            identityProvider: process.env.DFX_NETWORK === "ic"
                ? "https://identity.ic0.app"
                : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
            windowOpenerFeatures: "width=500,height=600,left=100,top=100,toolbar=0,location=0,menubar=0,scrollbars=1,resizable=1",
            onSuccess: async () => {
                try {
                    const initializedActor = await initActor();

                    const identity = authClient.getIdentity();
                    const principal = identity.getPrincipal().toString();

                    localStorage.setItem('authPrincipal', principal);

                    resolve(principal);
                } catch (error) {
                    console.error("Login failed:", error);
                    reject(error);
                }
            },
            onError: (error) => {
                console.error("Auth client login failed:", error);
                reject(error);
            }
        });
    });
}

export async function logout(): Promise<string> {
    try {
        await authClient?.logout();
        actor = null;
        localStorage.removeItem('authPrincipal');
        return "Logged out successfully";
    } catch (error) {
        console.error("Logout error:", error);

        actor = null;
        return "Logged out locally";
    }
}

export async function getActor(): Promise<_SERVICE> {
    if (!actor) {
        if (!authClient) {
            await initAuthClient();
        }
        actor = await initActor();
    }
    return actor;
}

export async function whoAmI(): Promise<string> {
    if (!authClient) {
        await initAuthClient();
    }

    if (!await isAuthenticated()) {
        throw new Error("User not authenticated");
    }

    const identity = authClient.getIdentity();
    const principal = identity.getPrincipal().toString();

    localStorage.setItem('authPrincipal', principal);

    return principal;
}

export async function isAuthenticated(): Promise<boolean> {
    if (!authClient) {
        await initAuthClient();
    }

    return authClient?.isAuthenticated() ?? false;
}

export function getPrincipal(): Principal | null {
    const principalString = localStorage.getItem('authPrincipal');
    return principalString ? Principal.fromText(principalString) : null;
}

export async function testBackendConnection(): Promise<boolean> {
    try {
        if (!actor && await isAuthenticated()) {
            await initActor();
        }

        if (!actor) {
            return false;
        }

        await actor.whoAmI();
        return true;
    } catch (error) {
        console.error("Backend connection test failed:", error);
        return false;
    }
}
