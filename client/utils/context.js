import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';
import {
  useWeb3ModalProvider,
  useWeb3ModalAccount,
} from '@web3modal/ethers5/react';
import { contractsConfig } from './contractsConfig';

const AppContext = createContext();

const ContextProvider = ({ children }) => {
  const [entities, setEntities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [entityPrice, setEntityPrice] = useState(null);
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();

  const initializeEthersProvider = () => {
    if (window.ethereum) {
      try {
        return new ethers.providers.Web3Provider(window.ethereum);
      } catch (error) {
        console.error('Failed to create a Web3Provider:', error);
      }
    } else {
      console.warn('Ethereum object not found.');
      return null;
    }
  };

  useEffect(() => {
    const getLatestEntityPrice = async () => {
      const ethersProvider = initializeEthersProvider();
      if (!ethersProvider) return;
      setIsLoading(true);
      try {
        const signer = ethersProvider.getSigner();
        const mintContract = new ethers.Contract(
          contractsConfig.mintAddress,
          contractsConfig.mintAbi,
          signer
        );
        const mintPrice = await mintContract.calculateMintPrice();
        const priceInEth = ethers.utils.formatEther(mintPrice);
        setEntityPrice(priceInEth);
      } catch (error) {
        console.error('Error fetching entity price:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getLatestEntityPrice();
  }, []);

  useEffect(() => {
    const loadedTransactions = localStorage.getItem('transactions');
    const initialTransactions = loadedTransactions
      ? JSON.parse(loadedTransactions)
      : [];
    setTransactions(initialTransactions);
    const ethersProvider = initializeEthersProvider();
    const mintContract = new ethers.Contract(
      contractsConfig.mintAddress,
      contractsConfig.mintAbi,
      ethersProvider
    );
    const nukeContract = new ethers.Contract(
      contractsConfig.nukeContractAddress,
      contractsConfig.nukeFundContractAbi,
      ethersProvider
    );

    const handleEvent =
      type =>
      async (...args) => {
        const event = args[args.length - 1];
        const transactionHash = event.transactionHash;
        const transaction = await defaultProvider.getTransaction(
          transactionHash
        );
        const valueInEth = ethers.utils.formatEther(transaction.value);
        const newTransaction = {
          type,
          from: 'Smart Contract',
          to: args[0],
          amount: valueInEth,
          timestamp: new Date().getTime(),
          transactionHash: transactionHash,
        };
        setTransactions(prevTransactions => {
          const updatedTransactions = [newTransaction, ...prevTransactions];
          localStorage.setItem(
            'transactions',
            JSON.stringify(updatedTransactions)
          );
          return updatedTransactions;
        });
      };
    mintContract.on('Minted', handleEvent('Minted'));
    mintContract.on('Entitybred', handleEvent('Entitybred'));
    nukeContract.on('Nuked', handleEvent('Nuked'));
    return () => {
      mintContract.off('Minted', handleEvent('Minted'));
      mintContract.off('Entitybred', handleEvent('Entitybred'));
      nukeContract.off('Nuked', handleEvent('Nuked'));
    };
}, []);

const getEntitiesForSale = async () => {
  if (!isConnected) return;
  try {
    const provider = new ethers.providers.Web3Provider(walletProvider);
    const tradeContract = new ethers.Contract(
      contractsConfig.tradeContractAddress,
      contractsConfig.tradeContractAbi,
      provider
    );
    const entropyContract = new ethers.Contract(
      contractsConfig.entropyContractAddress,
      contractsConfig.entropyContractAbi,
      provider
    );
    const data = await tradeContract.fetchEntitiesForSale();

    const entitiesPromises = data.map(async (entity) => {
      const [nukeFactor, breedPotential, performanceFactor, isSire] = await entropyContract.deriveTokenParameters(entity);

      return {
        entity,
        nukeFactor: nukeFactor.toString(),
        breedPotential: breedPotential.toString(),
        performanceFactor: performanceFactor.toString(),
        isSire: isSire,
        price: ethers.utils.formatEther(entity.price),
      };
    });

    const entities = await Promise.all(entitiesPromises);
    setEntities(entities);
  } catch (error) {
    console.error("Failed to fetch entities for sale:", error);
  }
};

const getEntitiesForForging = async () => {
  if (!isConnected) return;
  try {
    const provider = new ethers.providers.Web3Provider(walletProvider);
    const contract = new ethers.Contract(
      ForgeContractAddress,
      ForgeContractAbi,
      provider
    );
    const data = await contract.getAllEntitesForMerging();
    const forgingListings = data.map(async entity => {
      const [nukeFactor, breedPotential, performanceFactor, isSire] =
        await contract.deriveTokenParameters(entity);
      return {
        entity,
        nukeFactor: nukeFactor.toString(),
        breedPotential: breedPotential.toString(),
        performanceFactor: performanceFactor.toString(),
        isSire: isSire,
        price: ethers.utils.formatEther(entity.price),
      };
    });
    const entities = await Promise.all(forgingListings);
    setEntitiesForForging(entities);
  } catch (error) {
    console.error('Failed to fetch entities:', error);
  }
};
getEntitiesForForging();
}, [isConnected, walletProvider]);



const mintEntityHandler = async () => {
    if (!isConnected) {
      alert('Please connect your wallet.');
      return;
    }
    setIsLoading(true);
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const userAddress = await signer.getAddress();
      const mintContract = new ethers.Contract(
        contractsConfig.mintAddress,
        contractsConfig.mintAbi,
        signer
      );
      const transaction = await mintContract.mintToken(userAddress, {
        value: ethers.utils.parseEther(entityPrice),
        gasLimit: ethers.utils.hexlify(1000000),
      });
      await transaction.wait();
      alert('Entity minted successfully.');
    } catch (error) {
      console.error('Minting failed:', error);
      alert('Minting entity failed.');
    } finally {
      setIsLoading(false);
    }
};


function calculateEntityAttributes(entropy, entity) {
  const initializeEthersProvider = () =>
    window.ethereum
      ? new ethers.providers.Web3Provider(window.ethereum)
      : null;
  const ethersProvider = initializeEthersProvider();
  const contract = new ethers.Contract(
    contractsConfig.mintAddress,
    contractsConfig.mintAbi,
    ethersProvider
  );

  const getFinalNukeFactor = contract.calculateFinalNukeFactor(entity);

  const performanceFactor = entropy % 10;
  const lastTwoDigits = entropy % 100;
  const forgePotential = Math.floor(lastTwoDigits / 10);
  const nukeFactor = Number((entropy / 40000).toFixed(1));
  const finalNukeFactor = getFinalNukeFactor;
  let role;
  const result = entropy % 3;
  if (result === 0) {
    role = 'sire';
  } else {
    role = 'breeder';
  }

  return {
    role,
    forgePotential,
    nukeFactor,
    performanceFactor,
    finalNukeFactor,
  };
}







const subscribeToMintEvent = async () => {
    const ethersProvider = initializeEthersProvider();
    if (!ethersProvider) return;
    const contract = new ethers.Contract(
      contractsConfig.mintAddress,
      contractsConfig.mintAbi,
      ethersProvider.getSigner()
    );

    contract.on('Minted', (to, newItemId, entropyValue) => {
      setEntityItems(prevItems => {
        if (prevItems.length >= 150) {
          const updatedItems = [
            ...prevItems.slice(1),
            { id: newItemId, entropy: entropyValue },
          ];
          return updatedItems;
        } else {
          return [...prevItems, { id: newItemId, entropy: entropyValue }];
        }
      });
    });
    return () => {
      contract.removeAllListeners('Minted');
    };
};



return (
  <AppContext.Provider
    value={{
      entityPrice,
      isLoading,
      entities,
      transactions,
      getEntitiesForSale,
      getEntitiesForForging,
      mintEntityHandler,
      subscribeToMintEvent,
      calculateEntityAttributes,
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
