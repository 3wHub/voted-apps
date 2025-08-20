import { useState, useEffect } from 'react';
import { WalletService } from '@/services/wallet';
import {
  getPremiumPlanPrice,
  upgradeToPremiumWithPayment,
  hasSufficientBalance,
  UpgradeWithPaymentResult
} from '@/services/plan';
import { ICPService } from '@/services/icp';
import { whoAmI } from '@/services/auth';

interface WalletUpgradeProps {
  onUpgradeSuccess: (result: UpgradeWithPaymentResult) => void;
  onError: (error: string) => void;
  disabled?: boolean;
}

export default function WalletUpgrade({ onUpgradeSuccess, onError, disabled }: WalletUpgradeProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [premiumPrice, setPremiumPrice] = useState<number>(0);
  const [showWalletDetails, setShowWalletDetails] = useState(false);
  const [userPrincipal, setUserPrincipal] = useState<string>('');

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      const [price, principal] = await Promise.all([
        getPremiumPlanPrice(),
        whoAmI()
      ]);

      setPremiumPrice(price);
      setUserPrincipal(principal.toString());

      // Get current ICP balance
      const balance = await WalletService.getIcpBalance(principal.toString());
      setWalletBalance(balance);

      // Sync with backend
      await WalletService.syncWalletBalance();
    } catch (error) {
      console.error('Failed to load wallet data:', error);
      onError('Failed to load wallet information');
    }
  };

  const handleUpgradeWithWallet = async () => {
    if (disabled || isProcessing) return;

    setIsProcessing(true);

    try {
      // Check if user has sufficient balance
      const balanceE8s = BigInt(Math.round(walletBalance * 100000000));
      const hasSufficient = await hasSufficientBalance(balanceE8s);

      if (!hasSufficient) {
        onError(`Insufficient balance. You need at least ${premiumPrice} ICP to upgrade.`);
        return;
      }

      // Simulate payment transaction (in real implementation, this would interact with ICP ledger)
      const mockTransactionId = BigInt(Date.now());

      // Process upgrade with payment
      const result = await upgradeToPremiumWithPayment(mockTransactionId);

      // Update wallet balance after payment
      const newBalance = walletBalance - premiumPrice;
      setWalletBalance(newBalance);
      await WalletService.updateWalletBalance(BigInt(Math.round(newBalance * 100000000)));

      onUpgradeSuccess(result);

    } catch (error) {
      console.error('Upgrade failed:', error);
      onError('Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRefreshBalance = async () => {
    try {
      const balance = await WalletService.getIcpBalance(userPrincipal);
      setWalletBalance(balance);
      await WalletService.syncWalletBalance();
    } catch (error) {
      console.error('Failed to refresh balance:', error);
      onError('Failed to refresh wallet balance');
    }
  };

  const canAffordUpgrade = walletBalance >= premiumPrice;

  return (
    <div className="space-y-4">
      {/* Wallet Balance Display */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-gray-700">Wallet Balance</h3>
          <button
            onClick={handleRefreshBalance}
            className="text-xs text-blue-600 hover:text-blue-800"
          >
            Refresh
          </button>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            {walletBalance.toFixed(8)} ICP
          </span>
          <button
            onClick={() => setShowWalletDetails(!showWalletDetails)}
            className="text-xs text-gray-500 hover:text-gray-700"
          >
            {showWalletDetails ? 'Hide' : 'Show'} Details
          </button>
        </div>

        {showWalletDetails && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="text-xs text-gray-600 space-y-1">
              <p><strong>Principal:</strong> {userPrincipal}</p>
              <p><strong>Premium Price:</strong> {premiumPrice} ICP</p>
              <p><strong>After Upgrade:</strong> {(walletBalance - premiumPrice).toFixed(8)} ICP</p>
            </div>
          </div>
        )}
      </div>

      {/* Balance Warning */}
      {!canAffordUpgrade && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
          <div className="flex items-start">
            <svg className="w-5 h-5 text-yellow-400 mt-0.5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h4 className="text-sm font-medium text-yellow-800">Insufficient Balance</h4>
              <p className="text-sm text-yellow-700 mt-1">
                You need at least {premiumPrice} ICP to upgrade to Premium.
                Current balance: {walletBalance.toFixed(8)} ICP
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Button */}
      <button
        onClick={handleUpgradeWithWallet}
        disabled={disabled || isProcessing || !canAffordUpgrade}
        className={`
          w-full py-3 px-4 rounded-md text-sm font-medium
          flex items-center justify-center gap-2
          ${
            canAffordUpgrade && !disabled
              ? 'bg-orange-600 text-white hover:bg-orange-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }
          transition-colors duration-200
        `}
      >
        {isProcessing ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing Payment...
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            Pay {premiumPrice} ICP & Upgrade
          </>
        )}
      </button>

      {/* Payment Info */}
      <div className="text-xs text-gray-500 text-center">
        <p>Payment will be processed using your ICP wallet balance.</p>
        <p>Transaction fees may apply.</p>
      </div>
    </div>
  );
}
