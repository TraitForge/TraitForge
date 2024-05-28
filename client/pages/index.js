import { useState } from 'react';
import { ethers } from 'ethers';
import { useWeb3ModalProvider, useWeb3Modal } from '@web3modal/ethers/react';
import { toast } from 'react-toastify';

import { useContextState } from '@/utils/context';
import { Slider, Button, BudgetModal, LoadingSpinner } from '@/components';
import { mintBatchEntityHandler, mintEntityHandler } from '@/utils/utils';

const Home = () => {
  const { isLoading, setIsLoading, entityPrice } = useContextState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');

  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();

  const handleMintEntity = async () => {
    setIsLoading(true);
    await mintEntityHandler(walletProvider, open, entityPrice);
    setIsLoading(false);
  };

  const handleMintBatchEntity = async () => {
    setIsLoading(true);
    await mintBatchEntityHandler(walletProvider, open, budgetAmount);
    setIsLoading(false);
    setModalOpen(false);
  };

  if (isLoading)
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <LoadingSpinner color="#0ff" />
      </div>
    );

  return (
    <div
      className="mint-container h-screen"
      style={{
        backgroundImage: "url('/images/home.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <span
        title="Mint Your Traitforge Entity"
        className="headers text-[36px] mb-2.5 text-center md:text-extra-large"
      >
        Mint your traitforge entity
      </span>
      <div className="w-full flex justify-center max-md:mb-5">
        <Slider />
      </div>
      <div className="max-md:px-5 flex flex-col">
        <Button
          onClick={handleMintEntity}
          bg="#023340"
          borderColor="#0ADFDB"
          text={`Mint 1 For ${entityPrice} ETH`}
          style={{ marginBottom: '25px' }}
        />
        <Button
          onClick={() => setModalOpen(true)}
          bg="#023340"
          borderColor="#0ADFDB"
          text={`Mint With a Budget`}
        />
        {isModalOpen && (
          <BudgetModal
            bg="#023340"
            borderColor="#0ADFDB"
            budgetAmount={budgetAmount}
            setBudgetAmount={setBudgetAmount}
            onSubmit={handleMintBatchEntity}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
