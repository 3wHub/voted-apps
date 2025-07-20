// src/lib/api/api.ts
import { createActor, canisterId } from '../../../../declarations/backend';

// Create the actor instance once (reuse this across all API calls)
const backend = createActor(canisterId);
