import { AuthClient } from '@dfinity/auth-client';
import { createActor } from '../../../declarations/backend';
import { _SERVICE } from '../../../declarations/backend/backend.did';

let authClient: AuthClient;
let actor: _SERVICE;

export async function initAuthClient(): Promise<void> {
  authClient = await AuthClient.create();
}

export async function login(): Promise<string> {
  return new Promise((resolve, reject) => {
    authClient.login({
      identityProvider: process.env.DFX_NETWORK === "ic"
        ? "https://identity.ic0.app"
        : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
      // : `http://${process.env.CANISTER_ID_INTERNET_IDENTITY}.localhost:4943`,
      onSuccess: async () => {
        try {
          const identity = authClient.getIdentity();
          actor = createActor(process.env.CANISTER_ID ?? "", {
            agentOptions: { identity }
          });

          const result = await actor.login();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      },
      onError: reject
    });
  });
}

export async function logout(): Promise<string> {
  if (!actor) {
    throw new Error("Actor not initialized");
  }

  const result = await actor.logout();
  await authClient?.logout();
  return result;
}

export async function whoAmI(): Promise<string> {
  if (!actor) {
    throw new Error("Actor not initialized");
  }

  return await actor.whoAmI();
}

export async function isAuthenticated(): Promise<boolean> {
  if (!authClient) {
    await initAuthClient();
  }

  return authClient?.isAuthenticated() ?? false;
}
