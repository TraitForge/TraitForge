import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { ethers } from 'ethers';

import { JsonRpcProvider } from 'ethers/providers';
import { useWeb3ModalProvider } from '@web3modal/ethers/react';
import { contractsConfig } from './contractsConfig';
import {
  getEntitiesHook,
  getUpcomingMintsHook,
  getEntitiesForSaleHook,
  getOwnersEntitiesHook,
  getEntityEntropyHook,
  calculateNukeFactor,
  getEntityGeneration,
  calculateEntityAttributes,
} from './utils';
import { toast } from 'react-toastify';

const AppContext = createContext();
const infuraProvider = new JsonRpcProvider(contractsConfig.infuraRPCURL);

const ContextProvider = ({ children }) => {
  const [entitiesListedByUser, setEntitiesListedByUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [entityPrice, setEntityPrice] = useState(null);
  const [entityEntropy, setEntityEntropy] = useState('');
  const [ownerEntities, setOwnerEntities] = useState([]);
  const [address, setAddress] = useState('');
  const [entitiesForSale, setEntitiesForSale] = useState([]);
  const [upcomingMints, setUpcomingMints] = useState([]);
  const [entitiesForForging, setEntitiesForForging] = useState([]);
  const [transactions, setTransactions] = useState([]);

  const { walletProvider } = useWeb3ModalProvider();

  const getUpcomingMints = async (startSlot = 0, startNumberIndex = 0) => {
    if (!infuraProvider) return;
    setIsLoading(true);
    const { allEntropies, maxCount } = await getUpcomingMintsHook(
      startSlot,
      startNumberIndex,
      infuraProvider
    );
    setUpcomingMints(
      allEntropies.slice(0, maxCount).map((entropy, index) => ({
        id: startSlot * 13 + index,
        entropy,
      }))
    );
    setIsLoading(false);
  };

  const getEntitiesForSale = async () => {
    if (!infuraProvider || !walletProvider) return;

    try {
      const entitiesForSale = await getEntitiesForSaleHook(infuraProvider);
      const enrichedEntitiesForSale = await Promise.all(
        entitiesForSale.map(async entity => {
          const { tokenId, seller, price } = entity;
          const nukeFactor = await calculateNukeFactor(walletProvider, tokenId);
          const generation = await getEntityGeneration(walletProvider, tokenId);
          const entropy = await getEntityEntropyHook(walletProvider, tokenId);
          const paddedEntropy = entropy.toString().padStart(6, '0');
          const { role, forgePotential, performanceFactor } =
            calculateEntityAttributes(paddedEntropy);
          return {
            tokenId,
            seller,
            price,
            nukeFactor,
            generation,
            paddedEntropy,
            role,
            forgePotential,
            performanceFactor,
          };
        })
      );
      setEntitiesForSale(enrichedEntitiesForSale);
    } catch (error) {
      console.error('Failed to fetch entities for sale:', error);
      setEntitiesForSale([]);
    }
  };

  const getEntitiesForForging = async () => {
    if (!infuraProvider) return;
    try {
      const entitiesForForging = await getEntitiesHook(infuraProvider);
      const enrichedEntitiesForForging = await Promise.all(
        entitiesForForging.map(async entity => {
          const { tokenId, isListed, fee } = entity;
          const nukeFactor = await calculateNukeFactor(walletProvider, tokenId);
          const generation = await getEntityGeneration(walletProvider, tokenId);
          const entropy = await getEntityEntropyHook(walletProvider, tokenId);
          const paddedEntropy = entropy.toString().padStart(6, '0');
          const { role, forgePotential, performanceFactor } =
            calculateEntityAttributes(paddedEntropy);
          return {
            tokenId,
            isListed,
            fee,
            nukeFactor,
            generation,
            paddedEntropy,
            role,
            forgePotential,
            performanceFactor,
          };
        })
      );
      setEntitiesForForging(enrichedEntitiesForForging);
    } catch (error) {
      setEntitiesForForging([]);
    }
  };

  const getEntityEntropy = async listing => {
    if (!walletProvider) return;
    try {
      const entityEntropy = await getEntityEntropyHook(walletProvider, listing);
      setEntityEntropy(entityEntropy);
    } catch (error) {
      toast.error('Error fetching entity entropy');
      console.error('Error fetching entity entropy:', error);
    }
  };

  const getOwnersEntities = useCallback(async () => {
    if (!walletProvider) {
      open();
      setOwnerEntities([]);
      return;
    }
    try {
      const entities = await getOwnersEntitiesHook(walletProvider);
      const enrichedEntities = await Promise.all(
        entities.map(async tokenId => {
          const nukeFactor = await calculateNukeFactor(walletProvider, tokenId);
          const generation = await getEntityGeneration(walletProvider, tokenId);
          const entropy = await getEntityEntropyHook(walletProvider, tokenId);
          const paddedEntropy = entropy.toString().padStart(6, '0');
          const { role, forgePotential, performanceFactor } =
            calculateEntityAttributes(paddedEntropy);
          return {
            tokenId,
            nukeFactor,
            generation,
            paddedEntropy,
            role,
            forgePotential,
            performanceFactor,
          };
        })
      );
      setOwnerEntities(enrichedEntities);
      console.log("owners entities", enrichedEntities)
    } catch (error) {
      console.error('Error fetching NFTs:', error);
      setOwnerEntities([]);
    }
  }, [walletProvider]);

  useEffect(() => {
    setIsLoading(true);
    getOwnersEntities();
    getEntitiesForSale();
    getEntitiesForForging();
    getEntitiesListedByPlayer();
    setIsLoading(false);
  }, [walletProvider]);

  useEffect(() => {
    const getLatestEntityPrice = async () => {
      if (!infuraProvider) return;
      try {
        const mintContract = new ethers.Contract(
          contractsConfig.traitForgeNftAddress,
          contractsConfig.traitForgeNftAbi,
          infuraProvider
        );
        const mintPrice = await mintContract.calculateMintPrice();
        const priceInEth = ethers.formatEther(mintPrice);
        setEntityPrice(priceInEth);
      } catch (error) {
        console.error('Error fetching entity price:', error);
      }
    };

    getLatestEntityPrice();

    const intervalId = setInterval(() => {
      getLatestEntityPrice();
    }, 6000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (entityPrice) {
      const priceToIndex = Math.floor(entityPrice * 10000);
      const startSlot = Math.floor(priceToIndex / 13);
      const startNumberIndex = (priceToIndex % 13) -1;
      getUpcomingMints(startSlot, startNumberIndex);
    }
  }, [entityPrice]);
  //const subscribeToMintEvent = () => {
  //if (!infuraProvider) return;
  //
  //  const mintContract = new ethers.Contract(
  //    contractsConfig.traitForgeNftAddress,
  //    contractsConfig.traitForgeNftAbi,
  //    infuraProvider
  //  );
  //  const nukeContract = new ethers.Contract(
  //    contractsConfig.nukeContractAddress,
  //    contractsConfig.nukeFundContractAbi,
  //    infuraProvider
  //  );
  //
  //  const handleEvent = (type) => async (...args) => {
  //    const event = args[args.length - 1];
  //    const transactionHash = event.transactionHash;
  //    const transaction = await infuraProvider.getTransaction(transactionHash);
  //    const valueInEth = ethers.utils.formatEther(transaction.value);
  //    const newTransaction = {
  //      type,
  //      from: 'Smart Contract',
  //      to: args[0],
  //      amount: valueInEth,
  //      timestamp: new Date().getTime(),
  //      transactionHash,
  //    };
  //    setTransactions(prevTransactions => {
  //    const updatedTransactions = [newTransaction, ...prevTransactions];
  //    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  //    return updatedTransactions;
  //    });
  //  };
  //
  //  mintContract.on('Minted', handleEvent('Minted'));
  //  mintContract.on('Entitybred', handleEvent('Entitybred'));
  //  nukeContract.on('Nuked', handleEvent('Nuked'));
  //
  //  return () => {
  //  mintContract.off('Minted', handleEvent('Minted'));
  //  mintContract.off('Entitybred', handleEvent('Entitybred'));
  //  nukeContract.off('Nuked', handleEvent('Nuked'));
  //  };
  //};
  //
  //useEffect(() => {
  // Subscribe to mint events
  //const unsubscribe = subscribeToMintEvent();
  // return () => {
  //   unsubscribe();
  //};
  //}, [infuraProvider]);

  const getEntitiesListedByPlayer = async () => {
    if (!walletProvider) {
      console.error('No wallet provider found.');
      return;
    }

    try {
      const ethersProvider = new ethers.BrowserProvider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const address = await signer.getAddress();

      const listedEntities = entitiesForSale
        .filter(entity => entity.seller === address)
        .map(entity => ({
          tokenId: entity.tokenId,
          seller: entity.seller,
          price: entity.price,
          nukeFactor: entity.nukeFactor,
          generation: entity.generation,
          paddedEntropy: entity.paddedEntropy,
          role: entity.role,
          forgePotential: entity.forgePotential,
          performanceFactor: entity.performanceFactor,
        }));

      const forgingEntities = entitiesForForging
        .filter(entity =>
          ownerEntities.some(
            ownedEntity => ownedEntity.tokenId === entity.tokenId
          )
        )
        .map(entity => ({
          tokenId: entity.tokenId,
          price: entity.fee,
          nukeFactor: entity.nukeFactor,
          generation: entity.generation,
          paddedEntropy: entity.paddedEntropy,
          role: entity.role,
          forgePotential: entity.forgePotential,
          performanceFactor: entity.performanceFactor,
        }));

      const combinedListedEntities = [...listedEntities, ...forgingEntities];
      setEntitiesListedByUser(combinedListedEntities);
    } catch (error) {
      console.error('Failed to fetch entities listed by player:', error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        address,
        entityPrice,
        isLoading,
        transactions,
        infuraProvider,
        walletProvider,
        ownerEntities,
        setIsLoading,
        getOwnersEntities,
        upcomingMints,
        getUpcomingMints,
        entitiesForForging,
        getEntitiesForForging,
        getEntitiesListedByPlayer,
        entitiesListedByUser,
        entitiesForSale,
        getEntityEntropy,
        entityEntropy,
        getEntitiesForSale,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

const useContextState = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useContext must be used within a ContextProvider');
  }
  return context;
};

export { useContextState, ContextProvider };
