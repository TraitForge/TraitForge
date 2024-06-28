import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useState } from 'react';
import { FaWallet } from 'react-icons/fa';
import { formatEther } from 'viem';
import { useAccount, useBalance } from 'wagmi';
import { WalletModal } from '~/components/screens';
import { shortenAddress } from '~/utils';

export default function WalletButton() {
  const { address, isConnected } = useAccount();
  const { openConnectModal } = useConnectModal();
  const { data: balanceInfo } = useBalance();
  const ethBalance = Number(formatEther(balanceInfo?.value || 0n));

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        aria-label="connect wallet button"
        className="flex items-center gap-x-4 xl:gap-x-8"
        onClick={() => {
          if (isConnected) {
            setIsOpen(true);
          } else if (openConnectModal) {
            openConnectModal();
          }
        }}
      >
        <FaWallet />
        <span className="hidden lg:block text-base text-gray-200 lg:text-[32px] font-bebas">
          {isConnected ? shortenAddress(address || '0x0') : 'Connect'}
        </span>
      </button>
      {isOpen && (
        <WalletModal
          isOpen={isOpen}
          closeModal={() => setIsOpen(false)}
          balanceInETH={ethBalance}
        />
      )}
    </>
  );
}
