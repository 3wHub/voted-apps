import { Principal } from "@dfinity/principal";
import { ICPService } from "./icp";

export class WalletService {
    static async getIcpBalance(principal: string) {
        return await ICPService.getBalance(Principal.fromText(principal));
    }
}
