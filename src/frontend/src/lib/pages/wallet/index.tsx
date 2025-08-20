import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/helpers/useAuth';
import { Principal } from '@dfinity/principal';
import { ICPService } from '@/services/icp';
import { WalletService, WalletBalance } from '@/services/wallet';
import { getPaymentHistory, PaymentRecord } from '@/services/plan';
import Container from '@/lib/pages/components/Container';

export default function Wallet() {
    const { principal, isLoggedIn, handleLogin, loading: authLoading } = useAuth();
    const [balance, setBalance] = useState<number | null>(null);
    const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
    const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isLoggedIn && principal) {
            loadWalletData();
        }
    }, [isLoggedIn, principal]);

    const loadWalletData = async () => {
        setLoading(true);
        setError(null);
        try {
            // Load ICP balance
            const icpBalance = await WalletService.getIcpBalance(principal!);

            setBalance(icpBalance);

            // Load wallet balance from backend
            const backendBalance = await WalletService.getWalletBalance();
            setWalletBalance(backendBalance);

            // Load payment history
            const payments = await getPaymentHistory();
            setPaymentHistory(payments);

        } catch (error) {
            console.error("Failed to load wallet data:", error);
            setError('Failed to load wallet information');
        } finally {
            setLoading(false);
        }
    };

    const handleRefreshBalance = async () => {
        setRefreshing(true);
        try {
            // Sync wallet balance with ICP ledger
            const syncedBalance = await WalletService.syncWalletBalance();
            setWalletBalance(syncedBalance);

            // Update local balance display
            const icpBalance = await WalletService.getIcpBalance(principal!);
            setBalance(icpBalance);
        } catch (error) {
            console.error("Failed to refresh balance:", error);
            setError('Failed to refresh wallet balance');
        } finally {
            setRefreshing(false);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100';
            case 'pending': return 'text-yellow-600 bg-yellow-100';
            case 'failed': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    if (!isLoggedIn) {
        return (
            <Container>
                <div className="max-w-md mx-auto text-center py-12">
                    <div className="mb-8">
                        <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">ICP Wallet</h2>
                        <p className="text-gray-600">Please login to access your ICP wallet and payment history</p>
                    </div>
                    <button
                        onClick={handleLogin}
                        disabled={authLoading}
                        className="bg-orange-600 text-white px-6 py-3 rounded-md hover:bg-orange-700 disabled:opacity-50"
                    >
                        {authLoading ? 'Connecting...' : 'Login with Internet Identity'}
                    </button>
                </div>
            </Container>
        );
    }

    return (
        <Container>
            <div className="max-w-4xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ICP Wallet</h1>
                    <p className="text-gray-600">View your ICP balance and payment history</p>
                </header>

                {error && (
                    <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
                        {error}
                    </div>
                )}

                <div className="max-w-2xl mx-auto space-y-8">
                    {/* Balance Card */}
                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium">Available Balance</h3>
                            <button
                                onClick={handleRefreshBalance}
                                disabled={refreshing}
                                className="text-white hover:text-orange-100 disabled:opacity-50"
                            >
                                <svg className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                        <div className="text-3xl font-bold mb-2">
                            {balance !== null ? balance.toFixed(8) : '--'} ICP
                        </div>
                        <div className="text-sm text-orange-100">
                            Principal: {principal?.substring(0, 10)}...{principal?.slice(-4)}
                        </div>
                        {walletBalance && (
                            <div className="text-xs text-orange-100 mt-2">
                                Last synced: {formatDate(walletBalance.lastUpdated)}
                            </div>
                        )}
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Payment History</h3>
                        {loading ? (
                            <div className="text-center py-8">
                                <svg className="animate-spin h-8 w-8 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <p className="text-gray-500 mt-2">Loading...</p>
                            </div>
                        ) : paymentHistory.length > 0 ? (
                            <div className="space-y-3">
                                {paymentHistory.map((payment) => (
                                    <div key={payment.id} className="border border-gray-200 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-gray-900">
                                                {payment.planType.charAt(0).toUpperCase() + payment.planType.slice(1)} Plan
                                            </span>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                                                {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                                            </span>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <p><strong>Amount:</strong> {WalletService.formatIcpAmount(payment.amount)}</p>
                                            <p><strong>Transaction ID:</strong> {payment.transactionId.toString()}</p>
                                            <p><strong>Date:</strong> {formatDate(payment.createdAt)}</p>
                                            {payment.completedAt && (
                                                <p><strong>Completed:</strong> {formatDate(payment.completedAt)}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <svg className="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-gray-500">No payment history found</p>
                                <p className="text-sm text-gray-400 mt-1">Your plan upgrade payments will appear here</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Container>
    );
}
