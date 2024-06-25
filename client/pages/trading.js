import React, { useEffect, useState, useMemo } from 'react';
import { ethers } from 'ethers';
import { useWeb3Modal } from '@web3modal/ethers/react';
import { toast } from 'react-toastify';

import styles from '@/styles/trading.module.scss';
import { EntityCard, LoadingSpinner } from '@/components';
import { contractsConfig } from '@/utils/contractsConfig';
import { useContextState } from '@/utils/context';
import { TraidingHeader } from '@/screens/traiding/TraidingHeader';
import { SellEntity } from '@/screens/traiding/SellEntity';
import { BuyEntity } from '@/screens/traiding/BuyEntity';
import { ListEntity } from '@/screens/traiding/ListEntity';
import { FiltersHeader } from '@/components';
import { createContract, approveNFTForTrading } from '@/utils/utils';

const Marketplace = () => {
  const {
    isLoading,
    setIsLoading,
    ownerEntities,
    getOwnersEntities,
    entitiesForSale,
    getEntitiesForSale,
    walletProvider,
  } = useContextState();
  const [selectedForSale, setSelectedForSale] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [step, setStep] = useState('one');
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');
  const { open } = useWeb3Modal();

  const handleSort = type => setSortOption(type);

  useEffect(() => {
    getOwnersEntities();
    getEntitiesForSale();
  }, [walletProvider]);

  const handleFilterChange = (selectedOption, type) => {
    if (type === 'generation') {
      setGenerationFilter(selectedOption.value);
    } else if (type === 'sorting') {
      setSortingFilter(selectedOption.value);
    }
  };

  const filteredAndSortedListings = useMemo(() => {
    let filtered = entitiesForSale.filter(listing => {
      if (generationFilter && String(listing.generation) !== String(generationFilter)) {
        return false;
      }

      if (sortOption === 'all') return true;
      if (sortOption === 'forgers') return listing.role === 'Forger';
      if (sortOption === 'mergers') return listing.role === 'Merger';
      return true;
    });

    if (sortingFilter === 'price_low_to_high') {
      filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortingFilter === 'price_high_to_low') {
      filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }

    return filtered;
  }, [sortOption, generationFilter, sortingFilter, entitiesForSale]);

  const buyEntity = async entity => {
    setIsLoading(true);
    if (!walletProvider) open();
    try {
      const tradeContract = await createContract(
        walletProvider,
        contractsConfig.entityTradingContractAddress,
        contractsConfig.entityTradingAbi
      );
      const priceInWei = ethers.parseEther(entity.price);
      const transaction = await tradeContract.buyNFT(entity.tokenId, {
        value: priceInWei,
      });
      await transaction.wait();
      getOwnersEntities();
      getEntitiesForSale();
      toast.success('Entity purchased successfully!');
    } catch (error) {
      toast.error(`Purchase failed. Please try again`);
    } finally {
      setIsLoading(false);
    }
  };

  const listEntityForSale = async (entity, price) => {
    setIsLoading(true);
    if (!walletProvider) open();
    try {
      await approveNFTForTrading(entity.tokenId, walletProvider);

      const tradeContract = await createContract(
        walletProvider,
        contractsConfig.entityTradingContractAddress,
        contractsConfig.entityTradingAbi
      );
      const priceInWei = ethers.parseEther(price);
      const transaction = await tradeContract.listNFTForSale(entity.tokenId, priceInWei);
      await transaction.wait();
      getOwnersEntities();
      getEntitiesForSale();
      toast.success('Entity listed for sale successfully');
    } catch (error) {
      toast.error('Listing failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStep = step => setStep(step);

  let content;

  // if (isLoading)
  //   return (
  //     <div className="h-full w-full flex justify-center items-center">
  //       <LoadingSpinner color="#0EEB81" />
  //     </div>
  //   );

  switch (step) {
    case 'four':
      content = <BuyEntity handleStep={handleStep} selectedListing={selectedListing} buyEntity={buyEntity} />;
      break;
    case 'three':
      content = (
        <SellEntity handleStep={handleStep} selectedForSale={selectedForSale} listEntityForSale={listEntityForSale} />
      );
      break;
    case 'two':
      content = (
        <ListEntity
          ownerEntities={ownerEntities}
          handleStep={handleStep}
          setSelectedForSale={setSelectedForSale}
          selectedForSale={selectedForSale}
        />
      );
      break;
    default:
      content = (
        <>
          <div className="overflow-y-auto flex-1 border-t">
            <FiltersHeader
              sortOption={sortOption}
              handleSort={handleSort}
              color="green"
              handleFilterChange={(selectedOption, type) => handleFilterChange(selectedOption, type)}
              generationFilter={generationFilter}
              sortingFilter={sortingFilter}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-3 md:gap-x-[15px] mt-10 gap-y-7 lg:gap-y-10">
              {filteredAndSortedListings.map(entity => (
                <EntityCard
                  key={entity.tokenId}
                  entity={entity}
                  price={entity.price}
                  borderType="green"
                  onSelect={() => {
                    setSelectedListing(entity);
                    handleStep('four');
                  }}
                  showPrice={entity.price}
                />
              ))}
            </div>
          </div>
        </>
      );
  }

  return (
    <div className={styles.tradingPage}>
      <div className="container pt-10 md:pt-[54px] flex flex-col h-full">
        <TraidingHeader handleStep={handleStep} step={step} />
        {content}
      </div>
    </div>
  );
};

export default Marketplace;
