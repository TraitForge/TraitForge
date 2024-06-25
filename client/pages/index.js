import { useEffect, useState } from 'react';
import { useWeb3ModalProvider, useWeb3Modal } from '@web3modal/ethers/react';

import { useContextState } from '@/utils/context';
import { Slider, Button, BudgetModal, LoadingSpinner } from '@/components';
import { mintBatchEntityHandler, mintEntityHandler, getCurrentGenerationHook } from '@/utils/utils';

const Home = () => {
  const { isLoading, setIsLoading, entityPrice, infuraProvider } = useContextState();
  const [isModalOpen, setModalOpen] = useState(false);
  const [budgetAmount, setBudgetAmount] = useState('');
  const [currentGeneration, setCurrentGeneration] = useState(null);
  const { open } = useWeb3Modal();
  const { walletProvider } = useWeb3ModalProvider();

  const getCurrentGeneration = async () => {
    const generation = await getCurrentGenerationHook(infuraProvider);
    setCurrentGeneration(generation);
  };

  useEffect(() => {
    getCurrentGeneration();
  }, [getCurrentGeneration]);

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
      <div className="h-full w-full flex justify-center items-center">
        <LoadingSpinner color="#0ff" />
      </div>
    );

  return (
    <div
      className="mint-container h-full overflow-auto pb-5"
      style={{
        backgroundImage: "url('/images/home.png')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      <h1 title="Mint Your Traitforge Entity" className="headers text-[36px] mb-2.5 text-center md:text-extra-large">
        Mint your traitforge entity
      </h1>
      <div className="w-full flex justify-center overflow-hidden">
        <Slider currentGeneration={currentGeneration} />
      </div>
      <div className="max-md:px-5 flex flex-col max-md:mt-5">
        <Button
          onClick={handleMintEntity}
          bg="#023340"
          borderColor="#0ADFDB"
          text={`Mint 1 For ${entityPrice} ETH`}
          style={{ marginBottom: '25px' }}
          textClass="font-electrolize"
        />
        <Button
          onClick={() => setModalOpen(true)}
          bg="#023340"
          borderColor="#0ADFDB"
          text={`Mint With a Budget`}
          textClass="font-electrolize"
        />
        {isModalOpen && (
          <BudgetModal
            bg="#023340"
            borderColor="#0ADFDB"
            budgetAmount={budgetAmount}
            setBudgetAmount={setBudgetAmount}
            onSubmit={handleMintBatchEntity}
            onClose={() => setModalOpen(false)}
            className="font-bebas"
          />
        )}
      </div>
    </div>
  );
};

export default Home;
