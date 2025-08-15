import { AccountIdentifier, LedgerCanister } from '@dfinity/ledger-icp';
import { Principal } from '@dfinity/principal';
import { AuthClient } from '@dfinity/auth-client';
import { HttpAgent } from '@dfinity/agent';

let authClient: AuthClient;

export class ICPService {
    private static ledger: LedgerCanister;

    static async init() {
        authClient = await AuthClient.create();
        const identity = authClient.getIdentity();

        const agent = new HttpAgent({
            identity,
            host: process.env.DFX_NETWORK === 'ic' ? 'https://ic0.app' : 'http://localhost:4943'
        });

        if (process.env.DFX_NETWORK !== 'ic') {
            await agent.fetchRootKey();
        }

        const ledgerCanisterId = Principal.fromText(process.env.CANISTER_ID_ICP_LEDGER_CANISTER || 'ryjl3-tyaaa-aaaaa-aaaba-cai');

        this.ledger = LedgerCanister.create({
            agent,
            canisterId: ledgerCanisterId
        });
    }

    static async getBalance(principal: Principal): Promise<number> {
        await this.init();
        const accountIdentifier = AccountIdentifier.fromPrincipal({ principal });
        const balance = await this.ledger.accountBalance({
            accountIdentifier
        });

        return Number(balance) / 100000000;
    }

    static async transfer(to: string, amount: number): Promise<bigint> {
        await this.init();
        const amountE8s = BigInt(Math.round(amount * 100000000));
        return await this.ledger.transfer({
            to: AccountIdentifier.fromPrincipal({ principal: Principal.fromText(to) }),
            amount: amountE8s,
            fee: 10000n
        });
    }
}
