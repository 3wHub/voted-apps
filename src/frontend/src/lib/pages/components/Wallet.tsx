import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/helpers/useAuth';
import { ICPService } from '@/services/icp';
import { Principal } from '@dfinity/principal';

export const Wallet = () => {
    const { isLoggedIn, principal } = useAuth();
    const [balance, setBalance] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [recipient, setRecipient] = useState('');
    const [amount, setAmount] = useState('');

    useEffect(() => {
        if (isLoggedIn && principal) {
            ICPService.getBalance(Principal.fromText(principal))
                .then((setBalance))
                .catch(error => {
                    console.error("Failed to get balance:", error);
                    setBalance(null);
                });
        }
    }, [isLoggedIn, principal]);

    const handleTransfer = async () => {
        if (!amount || !recipient) return;

        setLoading(true);
        try {
            const blockHeight = await ICPService.transfer(recipient, parseFloat(amount));
            alert(`Transfer successful! Block height: ${blockHeight}`);
            if (principal) {
                const newBalance = await ICPService.getBalance(Principal.fromText(principal));
                setBalance(newBalance);
            }
        } catch (error) {
            console.error("Transfer failed:", error);
            alert(`Transfer failed: ${error instanceof Error ? error.message : error}`);
        } finally {
            setLoading(false);
        }
    };

    if (!isLoggedIn) return null;

    return (
        <div className="wallet-container">
            <h3>Your ICP Balance: {balance !== null ? balance.toFixed(4) : '--'} ICP</h3>

            <div className="transfer-form">
                <input
                    type="text"
                    placeholder="Recipient Principal"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount ICP"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    min="0"
                    step="0.0001"
                />
                <button
                    onClick={handleTransfer}
                    disabled={loading || !amount || !recipient}
                >
                    {loading ? 'Processing...' : 'Send ICP'}
                </button>
            </div>
        </div>
    );
};
