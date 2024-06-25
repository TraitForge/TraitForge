import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

import { useContextState } from '@/utils/context';
import { contractsConfig } from '@/utils/contractsConfig';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { Button, Modal, LoadingSpinner } from '@/components';
import { SelectEntityList } from '@/screens/forging/SelectEntityList';
import { WalletEntityModal } from '@/screens/forging/WalletEntityModal';
import { ListEntity } from '@/screens/forging/ListEntity';
import { ForgingArena } from '@/screens/forging/ForgingArena';
import { ListNow } from '@/screens/forging/ListNow';
import { createContract } from '@/utils/utils';

const Forging = () => {
  const { isLoading, setIsLoading, ownerEntities, getOwnersEntities, entitiesForForging, getEntitiesForForging } =
    useContextState();
  const [step, setStep] = useState('one');
  const [isEntityListModalOpen, setIsEntityListModalOpen] = useState(false);
  const [isOwnerListOpen, setIsOwnerListOpen] = useState(false);
  const [selectedFromPool, setSelectedFromPool] = useState(null);
  const [processing, setProcessing] = useState(false);
  const { walletProvider } = useWeb3ModalProvider();
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [selectedForListing, setSelectedForListing] = useState(null);
  const [processingText, setProcessingText] = useState('');
  const [generationFilter, setGenerationFilter] = useState('');

  const handleSelectedFromPool = entity => setSelectedFromPool(entity);
  const handleSelectedFromWallet = entity => setSelectedEntity(entity);

  const handleEntityListModal = () => setIsEntityListModalOpen(prevState => !prevState);
  const handleOwnerEntityList = () => setIsOwnerListOpen(prevState => !prevState);
  useEffect(() => {
    getOwnersEntities();
    getEntitiesForForging();
  }, [walletProvider]);

  const handleListingPage = () => setStep('two');

  const forgeEntity = async () => {
    setProcessing(true);
    setProcessingText('Forging');
    try {
      const forgeContract = await createContract(
        walletProvider,
        contractsConfig.entityMergingAddress,
        contractsConfig.entityMergingContractAbi
      );
      const feeInWei = BigInt(selectedFromPool.fee);
      const transaction = await forgeContract.forgeWithListed(selectedFromPool.tokenId, selectedEntity.tokenId, {
        value: feeInWei,
        gasLimit: 10000000,
      });
      await transaction.wait();
      setProcessingText('Merging');
      toast.success('Forged successfully');
    } catch (error) {
      toast.error(`Failed to Forge`);
    }
    setGenerationFilter('');
  };

  const listEntityForForging = async (selectedForListing, fee) => {
    setIsLoading(true);
    try {
      const forgeContract = await createContract(
        walletProvider,
        contractsConfig.entityMergingAddress,
        contractsConfig.entityMergingContractAbi
      );
      const feeInWei = ethers.parseEther(fee);
      const transaction = await forgeContract.listForForging(selectedForListing.tokenId, feeInWei);
      await transaction.wait();
      toast.success('Listed Successfully');
      setStep('one');
    } catch (error) {
      toast.error(`Failed to List Entity`);
    } finally {
      setIsLoading(false);
    }
  };

  let content;

  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingSpinner color="#FF5F1F" />
      </div>
    );

  switch (step) {
    case 'one':
      content = (
        <div className="max-md:h-full py-10 pt-5">
          <div className="h-full w-full">
            <div className="flex flex-col md:flex-row justify-center relative items-center">
              <h1 className="text-[36px] md:text-extra-large">Forging Arena</h1>
              <Button
                text="List for forging"
                bg="rgba(31, 15, 0,0.6)"
                width="200"
                height="90"
                borderColor="#FD8D26"
                className="relative md:absolute md:top-0 md:right-1 "
                onClick={handleListingPage}
                textClass="font-electrolize"
              />
            </div>
            <div className="py-7 md:py-10 3xl:py-20">
              <ForgingArena
                selectedFromPool={selectedFromPool}
                selectedFromWallet={selectedEntity}
                handleEntityListModal={handleEntityListModal}
                handleOwnerEntityList={handleOwnerEntityList}
              />
            </div>
            <div className="max-md:px-5">
              <Button
                text="forge entity"
                bg="rgba(31, 15, 0,0.6)"
                borderColor="#FD8D26"
                width="408"
                height="92"
                disabled={processing}
                onClick={forgeEntity}
                textClass="font-bebas text-[48px]"
              />
            </div>
          </div>
          {isEntityListModalOpen && (
            <Modal
              isOpen={isEntityListModalOpen}
              closeModal={() => setIsEntityListModalOpen(false)}
              modalClasses="items-end pb-4"
            >
              <SelectEntityList
                handleEntityListModal={handleEntityListModal}
                entitiesForForging={entitiesForForging}
                handleSelectedFromPool={handleSelectedFromPool}
              />
            </Modal>
          )}
          {isOwnerListOpen && (
            <Modal isOpen={isOwnerListOpen} closeModal={() => setIsOwnerListOpen(false)} modalClasses="items-end pb-4">
              <WalletEntityModal
                ownerEntities={ownerEntities}
                handleOwnerEntityList={handleOwnerEntityList}
                walletProvider={walletProvider}
                filterType="merger"
                handleSelectedFromWallet={handleSelectedFromWallet}
              />
            </Modal>
          )}
        </div>
      );
      break;
    case 'two':
      content = (
        <ListEntity
          closeModal={() => setStep('one')}
          ownerEntities={ownerEntities}
          walletProvider={walletProvider}
          setSelectedForListing={setSelectedForListing}
          handleStep={step => setStep(step)}
        />
      );
      break;
    case 'three':
      content = (
        <ListNow
          selectedForListing={selectedForListing}
          listEntityForForging={listEntityForForging}
          handleStep={step => setStep(step)}
        />
      );
      break;
  }

  return (
    <div
      className="mint-container h-full overflow-auto"
      style={{
        backgroundImage: "url('/images/forge-background.jpg')",
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
      }}
    >
      {content}
    </div>
  );
};

export default Forging;
