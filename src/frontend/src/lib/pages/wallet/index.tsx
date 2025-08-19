import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/helpers/useAuth';
import { Principal } from '@dfinity/principal';
import { ICPService } from '@/services/icp';

export default function Wallet() {
    const { principal, isLoggedIn } = useAuth();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');
    const [txHistory, setTxHistory] = useState<Array<{
        to: string;
        amount: number;
        timestamp: Date;
    }>>([]);

    // Fetch balance on load
    useEffect(() => {
        if (isLoggedIn && principal) {
            refreshBalance();
        }
    }, [isLoggedIn, principal]);

    const refreshBalance = async () => {
        try {
            setBalance(await ICPService.getBalance(Principal.fromText(principal!)));
        } catch (error) {
            console.error("Failed to fetch balance:", error);
        }
    };

    const handleTransfer = async () => {
        if (!amount || !recipient) return;

        setLoading(true);
        try {
            const amountNum = parseFloat(amount);
            const blockHeight = await ICPService.transfer(recipient, amountNum);

            setTxHistory(prev => [{
                to: recipient,
                amount: amountNum,
                timestamp: new Date()
            }, ...prev]);

            alert(`Transfer successful! Block: ${blockHeight}`);
            await refreshBalance();
            setRecipient('');
            setAmount('');
        } catch (error) {
            alert(`Transfer failed: ${error instanceof Error ? error.message : error}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) {
        return (
            <div className="p-6 max-w-md mx-auto text-center">
                <h2 className="text-2xl font-bold mb-4">Wallet</h2>
                <p>Please login to access your ICP wallet</p>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6">Your ICP Wallet</h2>

            {/* Balance Card */}
            <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-indigo-600">Available Balance</p>
                <p className="text-3xl font-bold">
                    {balance !== null ? balance.toFixed(4) : '--'} <span className="text-lg">ICP</span>
                </p>
            </div>

            {/* Transfer Form */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">
                <h3 className="font-medium mb-3">Send ICP</h3>
                <div className="space-y-3">
                    <div>
                        <label className="block text-sm font-medium mb-1">Recipient Principal</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded"
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="e.g. jjwmb-twivm-wvbgl..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Amount (ICP)</label>
                        <input
                            type="number"
                            className="w-full p-2 border rounded"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            min="0"
                            step="0.0001"
                            placeholder="0.00"
                        />
                    </div>
                    <button
                        onClick={handleTransfer}
                        disabled={loading || !amount || !recipient}
                        className={`w-full py-2 rounded text-white ${loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                    >
                        {loading ? 'Processing...' : 'Send'}
                    </button>
                </div>
            </div>

            {/* Transaction History */}
            {txHistory.length > 0 && (
                <div className="mt-6">
                    <h3 className="font-medium mb-2">Recent Transactions</h3>
                    <div className="space-y-2">
                        {txHistory.map((tx, index) => (
                            <div key={index} className="bg-gray-50 p-3 rounded flex justify-between">
                                <div>
                                    <p className="font-medium">To: {tx.to.substring(0, 10)}...{tx.to.slice(-4)}</p>
                                    <p className="text-sm text-gray-500">
                                        {tx.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                                <p className="text-red-600 font-medium">-{tx.amount} ICP</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
