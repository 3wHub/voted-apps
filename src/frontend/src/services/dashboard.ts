import { Principal } from '@dfinity/principal';
import { ICPService } from "./icp";
import { countPollsByAgent } from './vote';

export class DashboardService {
    static async getMyPolls() {
        return [
            {
                id: '1',
                question: 'What is your favorite color?',
                tags: ['fun', 'color'],
                created_at: new Date().toISOString(),
            },
        ];
    }

    static async getMyStats() {
        return {
            voteCount: 12,
            createdCount: await countPollsByAgent(),
        };
    }

    static async getIcpBalance(principal: string) {
        return await ICPService.getBalance(Principal.fromText(principal!));
    }
}
