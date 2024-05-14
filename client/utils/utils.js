import { ethers } from 'ethers';

import { contractsConfig } from './contractsConfig';

export function calculateEntityAttributes(entropy) {
  const performanceFactor = entropy.toString() % 10;
  const lastTwoDigits = entropy.toString() % 100;
  const forgePotential = Math.floor(lastTwoDigits / 10);
  const nukeFactor = Number((entropy / 40000).toFixed(3));
  let role;
  const result = entropy.toString() % 3;
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
  const mintContract = new ethers.Contract(address, abi, signer);
  return mintContract;
}

export const getEntitiesHook = async infuraProvider => {
  const contract = new ethers.Contract(
    contractsConfig.forgeContractAddress,
    contractsConfig.forgeContractAbi,
    infuraProvider
  );
  const data = await contract.getAllEntitiesForMerging();
  const entitiesForForging = await Promise.all(data);
  return entitiesForForging;
};

export const getUpcomingMintsHook = async (
  startSlot,
  startNumberIndex,
  infuraProvider
) => {
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
      for (
        let numberIndex = startNumberIndex;
        numberIndex < 13 && allEntropies.length < maxCount;
        numberIndex++
      ) {
        const promise = contract
          .getPublicEntropy(startSlot, numberIndex)
          .then(value => parseInt(value, 10))
          .catch(error => {
            console.error('Error fetching entropy:', error);
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
    contractsConfig.tradeContractAddress,
    contractsConfig.tradeContractAbi,
    infuraProvider
  );
  const data = await tradeContract.fetchEntitiesForSale();
  const entitiesForSale = await Promise.all(data);
  return entitiesForSale;
};

export const getOwnersEntitiesHook = async walletProvider => {
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
    fetchPromises.push(
      (async () => {
        const tokenId = await TraitForgeContract.tokenOfOwnerByIndex(
          address,
          i
        );
        const entropy = await TraitForgeContract.getTokenEntropy(tokenId);
        return { tokenId: tokenId.toString(), entropy };
      })()
    );
  }

  const entities = await Promise.all(fetchPromises);

  return entities;
};
