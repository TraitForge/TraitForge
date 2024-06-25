import { ethers } from 'ethers';
import { toast } from 'react-toastify';
import axios from 'axios';

import { contractsConfig } from './contractsConfig';

export function calculateEntityAttributes(paddedEntropy) {
  const paddedEntropyNumber = Number(paddedEntropy);
  const performanceFactor = paddedEntropyNumber % 10;
  const lastTwoDigits = paddedEntropyNumber % 100;
  const forgePotential = Math.floor(lastTwoDigits / 10);
  const nukeFactor = Number((paddedEntropyNumber / 40000).toFixed(3));
  let role;
  const result = paddedEntropyNumber % 3;
  if (result === 0) {
    role = 'Forger';
  } else {
    role = 'Merger';
  }
  return { role, forgePotential, nukeFactor, performanceFactor };
}

export async function createContract(walletProvider, address, abi) {
  const ethersProvider = new ethers.BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const contract = new ethers.Contract(address, abi, signer);
  return contract;
}

export const getEntitiesHook = async infuraProvider => {
  const contract = new ethers.Contract(
    contractsConfig.entityMergingAddress,
    contractsConfig.entityMergingContractAbi,
    infuraProvider
  );
  const listings = await contract.fetchListings();
  return listings;
};

export const getUpcomingMintsHook = async (startSlot, startNumberIndex, infuraProvider) => {
  const contract = new ethers.Contract(
    contractsConfig.entropyGeneratorContractAddress,
    contractsConfig.entropyGeneratorContractAbi,
    infuraProvider
  );

  let allEntropies = [];
  let maxSlot = 770;
  let maxCount = 50;

  try {
    while (allEntropies.length < maxCount && startSlot < maxSlot) {
      const promises = [];
      for (let numberIndex = startNumberIndex; numberIndex < 13 && allEntropies.length < maxCount; numberIndex++) {
        const promise = contract
          .getPublicEntropy(startSlot, numberIndex)
          .then(value => parseInt(value, 10)) //TODO check decimale
          .catch(error => {
            return 0;
          });
        promises.push(promise);
      }
      const results = await Promise.all(promises);
      allEntropies = allEntropies.concat(results);
      startSlot++;
      startNumberIndex = 0;
    }
  } catch (error) {
    console.error('Unhandled error:', error);
  }

  return { allEntropies, maxCount };
};

export const getEntitiesForSaleHook = async infuraProvider => {
  const tradeContract = new ethers.Contract(
    contractsConfig.entityTradingContractAddress,
    contractsConfig.entityTradingAbi,
    infuraProvider
  );
  const [tokenIds, sellers, prices] = await tradeContract.fetchListedEntities();
  const listedEntities = tokenIds.map((tokenId, index) => ({
    tokenId: tokenId,
    seller: sellers[index],
    price: ethers.formatEther(prices[index]),
  }));
  return listedEntities;
};

export const getOwnersEntitiesHook = async walletProvider => {
  try {
    const ethersProvider = new ethers.BrowserProvider(walletProvider);
    const signer = await ethersProvider.getSigner();
    const address = await signer.getAddress();
    const TraitForgeContract = new ethers.Contract(
      contractsConfig.traitForgeNftAddress,
      contractsConfig.traitForgeNftAbi,
      ethersProvider
    );

    const balance = await TraitForgeContract.balanceOf(address);
    const fetchPromises = [];

    for (let i = 0; i < balance; i++) {
      fetchPromises.push(TraitForgeContract.tokenOfOwnerByIndex(address, i));
    }

    const entities = await Promise.all(fetchPromises);
    return entities;
  } catch (error) {
    throw error;
  }
};

export const getEntityEntropyHook = async (walletProvider, entity) => {
  const ethersProvider = new ethers.BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const TraitForgeContract = new ethers.Contract(
    contractsConfig.traitForgeNftAddress,
    contractsConfig.traitForgeNftAbi,
    signer
  );
  const entityEntropy = await TraitForgeContract.getTokenEntropy(entity);
  return entityEntropy;
};

export const getEntityGeneration = async (walletProvider, listing) => {
  const ethersProvider = new ethers.BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const TraitForgeContract = new ethers.Contract(
    contractsConfig.traitForgeNftAddress,
    contractsConfig.traitForgeNftAbi,
    signer
  );
  const entityGeneration = await TraitForgeContract.getTokenGeneration(listing);
  return entityGeneration.toString();
};

export const getCurrentGenerationHook = async infuraProvider => {
  if (!infuraProvider) return;
  try {
    const TraitForgeContract = new ethers.Contract(
      contractsConfig.traitForgeNftAddress,
      contractsConfig.traitForgeNftAbi,
      infuraProvider
    );
    const currentGeneration = await TraitForgeContract.getGeneration();
    return currentGeneration.toString();
  } catch (err) {
    toast.error('Failed to fetch current generation:');
  }
};

export const isForger = async (walletProvider, entity) => {
  const ethersProvider = new ethers.BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const TraitForgeContract = new ethers.Contract(
    contractsConfig.traitForgeNftAddress,
    contractsConfig.traitForgeNftAbi,
    signer
  );
  const isForger = await TraitForgeContract.isForger(entity);
  return isForger;
};

export const calculateNukeFactor = async (walletProvider, entity) => {
  const ethersProvider = new ethers.BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const nukeContract = new ethers.Contract(
    contractsConfig.nukeContractAddress,
    contractsConfig.nukeFundContractAbi,
    signer
  );
  const finalNukeFactor = await nukeContract.calculateNukeFactor(entity);
  const formattedNukeFactor = (Number(finalNukeFactor) / 1000).toFixed(3).toString();
  return formattedNukeFactor;
};

export const approveNFTForTrading = async (tokenId, walletProvider) => {
  if (!walletProvider) {
    alert('Please connect your wallet first.');
    return;
  }
  try {
    const nftContract = await createContract(
      walletProvider,
      contractsConfig.traitForgeNftAddress,
      contractsConfig.traitForgeNftAbi
    );
    const transaction = await nftContract.approve(contractsConfig.entityTradingContractAddress, tokenId);
    await transaction.wait();

    toast.success('NFT approved successfully');
  } catch (error) {
    toast.error(`Approval failed. Please try again`);
  }
};

export const approveNFTForNuking = async (tokenId, walletProvider) => {
  if (!walletProvider) {
    alert('Please connect your wallet first.');
    return;
  }
  try {
    const nftContract = await createContract(
      walletProvider,
      contractsConfig.traitForgeNftAddress,
      contractsConfig.traitForgeNftAbi
    );
    const transaction = await nftContract.approve(contractsConfig.nukeContractAddress, tokenId);
    await transaction.wait();
    toast.success('NFT approved successfully');
  } catch (error) {
    toast.error(`Approval failed. Please try again.`);
  }
};

export const mintEntityHandler = async (walletProvider, open, entityPrice) => {
  if (!walletProvider) return open();

  try {
    const mintContract = await createContract(
      walletProvider,
      contractsConfig.traitForgeNftAddress,
      contractsConfig.traitForgeNftAbi
    );
    const transaction = await mintContract.mintToken({
      value: ethers.parseEther(entityPrice),
      gasLimit: 5000000,
    });
    await transaction.wait();
    toast.success('Entity minted successfully');
  } catch (error) {
    toast.error(`Minting entity failed`);
  }
};

export const mintBatchEntityHandler = async (walletProvider, open, budgetAmount) => {
  if (!walletProvider) return open();
  try {
    const mintContract = await createContract(
      walletProvider,
      contractsConfig.traitForgeNftAddress,
      contractsConfig.traitForgeNftAbi
    );
    const transaction = await mintContract.mintWithBudget({
      value: ethers.parseEther(budgetAmount),
      gasLimit: 5000000,
    });
    await transaction.wait();
    toast.success('Entity minted successfully');
  } catch (error) {
    toast.error(`Minting entity failed`);
  }
};

export const shortenAddress = address => {
  // Ensure the address is in the correct format
  if (typeof address !== 'string' || !address.startsWith('0x') || address.length !== 42) {
    throw new Error('Invalid Ethereum address');
  }

  // Extract the first four characters (including '0x')
  const firstPart = address.slice(0, 4);

  // Extract the last four characters
  const lastPart = address.slice(-4);

  // Combine the parts with '......' in between
  const shortenedAddress = `${firstPart}......${lastPart}`;

  return shortenedAddress;
};

export const getEntitiesListedByPlayer = async walletProvider => {
  const ethersProvider = new ethers.BrowserProvider(walletProvider);
  const signer = await ethersProvider.getSigner();
  const address = await signer.getAddress();

  const tradeContract = new ethers.Contract(
    contractsConfig.entityTradingContractAddress,
    contractsConfig.entityTradingAbi,
    signer
  );

  const forgeContract = new ethers.Contract(
    contractsConfig.entityMergingAddress,
    contractsConfig.entityMergingContractAbi,
    signer
  );
  const [tradeTokenIds, tradeSellers, tradePrices] = await tradeContract.fetchListedEntities();
  const [forgeTokenIds, forgeSellers, forgePrices] = await forgeContract.fetchListings();
  const listedEntities = [];

  for (let i = 0; i < tradeTokenIds.length; i++) {
    if (address === tradeSellers[i]) {
      listedEntities.push({
        tokenId: tradeTokenIds[i],
        seller: tradeSellers[i],
        price: ethers.formatEther(tradePrices[i]),
      });
    }
  }

  for (let i = 0; i < forgeTokenIds.length; i++) {
    if (address === forgeSellers[i]) {
      listedEntities.push({
        tokenId: forgeTokenIds[i],
        seller: forgeSellers[i],
        price: ethers.formatEther(forgePrices[i]),
      });
    }
  }

  return listedEntities;
};

export const getWalletBalance = async (walletProvider, address) => {
  if (!walletProvider) return null;
  const provider = new ethers.BrowserProvider(walletProvider);
  const balance = await provider.getBalance(address);
  const balanceInETH = ethers.formatEther(balance);
  const balanceInETHShortened = parseFloat(balanceInETH).toFixed(6);

  return balanceInETHShortened;
};

export const fetchEthToUsdRate = async () => {
  try {
    const response = await axios.get('https://min-api.cryptocompare.com/data/pricemulti?fsyms=ETH&tsyms=USD');
    return response.data.ETH.USD;
  } catch (error) {
    console.error('Error fetching ETH to USD rate:', error);
  }
  return null;
};

export const fetchEthAmount = async infuraProvider => {
  if (!infuraProvider) return;
  try {
    const nukeFundContract = new ethers.Contract(
      contractsConfig.nukeContractAddress,
      contractsConfig.nukeFundContractAbi,
      infuraProvider
    );
    const balance = await nukeFundContract.getFundBalance();
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error fetching ETH amount from nuke fund:', error);
    return 0;
  }
};

export const handlePrice = async infuraProvider => {
  const amount = await fetchEthAmount(infuraProvider);
  const rate = await fetchEthToUsdRate();

  let ethAmount;
  let usdAmount;

  if (amount && rate) {
    const usdValue = amount * rate;
    ethAmount = Number(amount).toFixed(5);
    usdAmount = Number(usdValue).toFixed(5);
  }
  return {
    ethAmount,
    usdAmount,
  };
};
