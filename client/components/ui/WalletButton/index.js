import { useState, useEffect } from 'react';
import { FaWallet } from 'react-icons/fa';
import { useWeb3ModalAccount, useWeb3Modal, useWeb3ModalProvider } from '@web3modal/ethers/react';

import { WalletModal } from '@/screens/wallet/WallterModal';
import { getWalletBalance } from '@/utils/utils';

export default function ConnectButton() {
  const [isOpen, setIsOpen] = useState(false);
  const { isConnected } = useWeb3ModalAccount();
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();
  const [balanceInETH, setBalanceInETH] = useState('');
  const { address } = useWeb3ModalAccount();

  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getWalletBalance(walletProvider, address);
      setBalanceInETH(balance);
    };
    fetchBalance();
  }, [walletProvider]);

  return (
    <>
      <button
        aria-label="connect wallet button"
        className="flex items-center gap-x-4 xl:gap-x-8"
        onClick={() => {
          isConnected ? setIsOpen(true) : open();
        }}
      >
        <FaWallet />
        <span className="hidden lg:block text-base text-gray-200 lg:text-[32px] font-bebas">wallet</span>
      </button>
      {isOpen && <WalletModal isOpen={isOpen} closeModal={() => setIsOpen(false)} balanceInETH={balanceInETH} />}
    </>
  );
}
