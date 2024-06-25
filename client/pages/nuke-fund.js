import React, { useState, useMemo, useEffect } from 'react';
import { useWeb3Modal } from '@web3modal/ethers/react';
import { toast } from 'react-toastify';
import { JsonRpcProvider } from 'ethers/providers';

import styles from '@/styles/honeypot.module.scss';
import { contractsConfig } from '@/utils/contractsConfig';
import { HoneyPotHeader } from '@/screens/honey-pot/HoneyPotHeader';
import { EntityCard, LoadingSpinner } from '@/components';
import { HoneyPotBody } from '@/screens/honey-pot/HoneyPotBody';
import { NukeEntity } from '@/screens/honey-pot/NukeEntity';
import { FiltersHeader } from '@/components';
import { useContextState } from '@/utils/context';
import { handlePrice, approveNFTForNuking, createContract } from '@/utils/utils';

const infuraProvider = new JsonRpcProvider(contractsConfig.infuraRPCURL);

const HoneyPot = ({ usdAmount, ethAmount }) => {
  const { isLoading, setIsLoading, ownerEntities, walletProvider, getOwnersEntities } = useContextState();
  const [selectedForNuke, setSelectedForNuke] = useState(null);
  const [step, setStep] = useState('one');
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');
  const { open } = useWeb3Modal();

  const handleStep = nextStep => setStep(nextStep);

  const handleSort = type => setSortOption(type);

  const handleFilterChange = (selectedOption, type) => {
    if (type === 'generation') {
      setGenerationFilter(selectedOption.value);
    } else if (type === 'sorting') {
      setSortingFilter(selectedOption.value);
    }
  };

  const filteredAndSortedListings = useMemo(() => {
    let filtered = ownerEntities.filter(listing => {
      if (generationFilter && String(listing.generation) !== String(generationFilter)) {
        return false;
      }

      if (sortOption === 'all') return true;
      if (sortOption === 'forgers') return listing.role === 'Forger';
      if (sortOption === 'mergers') return listing.role === 'Merger';
      return true;
    });

    if (sortingFilter === 'NukeFactor_low_to_high') {
      filtered.sort((a, b) => parseFloat(a.nukeFactor) - parseFloat(b.nukeFactor));
    } else if (sortingFilter === 'NukeFactor_high_to_low') {
      filtered.sort((a, b) => parseFloat(b.nukeFactor) - parseFloat(a.nukeFactor));
    }

    return filtered;
  }, [sortOption, generationFilter, sortingFilter, ownerEntities]);

  const nukeEntity = async entity => {
    if (!walletProvider) open();
    setIsLoading(true);
    try {
      await approveNFTForNuking(entity.tokenId, walletProvider);
      const nukeContract = await createContract(
        walletProvider,
        contractsConfig.nukeContractAddress,
        contractsConfig.nukeFundContractAbi
      );
      const transaction = await nukeContract.nuke(entity.tokenId);
      await transaction.wait();
      getOwnersEntities();
      toast.success('Entity Nuked successfully!');
    } catch (error) {
      console.error(error);
      toast.error(`Nuke failed. Please try again`);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading)
    return (
      <div className="h-full w-full flex justify-center items-center">
        <LoadingSpinner color="#9457EB" />
      </div>
    );

  let content;

  switch (step) {
    case 'three':
      content = (
        <NukeEntity selectedForNuke={selectedForNuke} nukeEntity={nukeEntity} handleStep={step => setStep(step)} />
      );
      break;
    case 'two':
      content = (
        <div className="overflow-y-scroll flex-1">
          <FiltersHeader
            pageType="nuke"
            sortOption={sortOption}
            handleSort={handleSort}
            color="purple"
            handleFilterChange={(selectedOption, type) => handleFilterChange(selectedOption, type)}
            generationFilter={generationFilter}
            sortingFilter={sortingFilter}
          />
          <div className="grid mt-10 grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-5 md:gap-y-10">
            {filteredAndSortedListings.map(entity => (
              <EntityCard
                key={entity.tokenId}
                entity={entity}
                borderType="purple"
                onSelect={() => {
                  setSelectedForNuke(entity);
                  setStep('three');
                }}
              />
            ))}
          </div>
        </div>
      );
      break;
    default:
      content = (
        <HoneyPotBody handleStep={() => setStep('two')} usdAmountInitial={usdAmount} ethAmountInitial={ethAmount} />
      );
  }

  return (
    <div className={styles.honeyPotContainer}>
      <div className="container flex flex-col h-full ">
        <HoneyPotHeader step={step} handleStep={handleStep} />
        {content}
      </div>
    </div>
  );
};

export default HoneyPot;

export const getStaticProps = async () => {
  const { ethAmount, usdAmount } = await handlePrice(infuraProvider);

  return {
    props: {
      usdAmount,
      ethAmount,
    },
  };
};
