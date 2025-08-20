import { Principal } from "@dfinity/principal";
import { ICPService } from "./icp";
import { createActor, canisterId } from '../../../declarations/backend';
import { whoAmI } from './auth';

const backend = createActor(canisterId);

export interface WalletBalance {
  agentId: string;
  balance: bigint;
  lastUpdated: string;
}

export class WalletService {
    static async getIcpBalance(principal: string): Promise<number> {
        try {
            // First try to get balance from backend (if user has made transactions)
            const agentId = principal;
            const response = await backend.getWalletBalance(agentId);
            
            if (response.length > 0) {
                return Number(response[0].balance) / 100000000;
            }
        } catch (error) {
            console.log('No backend balance found, falling back to ICP ledger');
        }
        
        // Fallback to ICP ledger balance
        return await this.getIcpLedgerBalance(principal);
    }

    static async getIcpLedgerBalance(principal: string): Promise<number> {
        return await ICPService.getBalance(Principal.fromText(principal));
    }

    static async getWalletBalance(): Promise<WalletBalance | null> {
        const agentId = (await whoAmI()).toString();
        if (!agentId) throw new Error('Authentication required');

        const response = await backend.getWalletBalance(agentId);
        
        if (response.length === 0) return null;
        
        return {
            agentId: response[0].agentId,
            balance: response[0].balance,
            lastUpdated: response[0].lastUpdated,
        };
    }

    static async updateWalletBalance(balance: bigint): Promise<WalletBalance> {
        const agentId = (await whoAmI()).toString();
        if (!agentId) throw new Error('Authentication required');

        const response = await backend.updateWalletBalance(agentId, balance);
        
        return {
            agentId: response.agentId,
            balance: response.balance,
            lastUpdated: response.lastUpdated,
        };
    }

    static async syncWalletBalance(): Promise<WalletBalance> {
        const agentId = (await whoAmI()).toString();
        if (!agentId) throw new Error('Authentication required');

        // Get balance from ICP ledger
        const icpBalance = await this.getIcpBalance(agentId);
        const balanceE8s = BigInt(Math.round(icpBalance * 100000000));
        
        // Update in backend
        return await this.updateWalletBalance(balanceE8s);
    }

    
    static formatIcpAmount(amountE8s: bigint): string {
        const icp = Number(amountE8s) / 100000000;
        return `${icp.toFixed(8)} ICP`;
    }

    static parseIcpAmount(icpAmount: string): bigint {
        const amount = parseFloat(icpAmount);
        return BigInt(Math.round(amount * 100000000));
    }
}
