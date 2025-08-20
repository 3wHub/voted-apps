import { Actor, HttpAgent } from '@dfinity/agent';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import { idlFactory } from '../../../declarations/backend';
import { _SERVICE } from '../../../declarations/backend/backend.did';

let cachedActor: _SERVICE | null = null;
let authClient: AuthClient | null = null;

export async function createRobustActor(): Promise<_SERVICE> {
    if (cachedActor) {
        return cachedActor;
    }

    try {
        // Initialize auth client if not already done
        if (!authClient) {
            authClient = await AuthClient.create();
        }

        const identity = authClient.getIdentity();
        const isLocal = process.env.DFX_NETWORK !== "ic";
        const host = isLocal ? "http://localhost:4943" : "https://ic0.app";

        const agent = new HttpAgent({
            identity,
            host,
        });

        // Handle local development certificate verification
        if (isLocal) {
            try {
                await agent.fetchRootKey();
            } catch (error) {
                console.warn("Unable to fetch root key for local development:", error);
                // Continue anyway for local development
            }
        }

        const canisterId = process.env.CANISTER_ID_BACKEND;
        if (!canisterId) {
            throw new Error("Backend canister ID not found");
        }

        cachedActor = Actor.createActor(idlFactory, {
            agent,
            canisterId: Principal.fromText(canisterId),
        });

        return cachedActor;
    } catch (error) {
        console.error("Failed to create robust actor:", error);
        throw error;
    }
}

export function clearActorCache(): void {
    cachedActor = null;
}

// Retry wrapper for actor calls
export async function retryActorCall<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
): Promise<T> {
    let lastError: Error;

    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error) {
            lastError = error as Error;
            
            // If it's a certificate verification error, clear cache and retry
            if (error instanceof Error && error.message.includes('Certificate verification')) {
                clearActorCache();
                
                // Wait before retrying
                if (i < maxRetries - 1) {
                    await new Promise(resolve => setTimeout(resolve, delay));
                }
                continue;
            }
            
            // For other errors, don't retry
            throw error;
        }
    }

    throw lastError!;
}