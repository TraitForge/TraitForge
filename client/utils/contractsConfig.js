import TraitForgeNftAbi from '../../solidity/artifacts/contracts/TraitForgeNft/TraitForgeNft.sol/TraitForgeNft.json';
import EntropyGenerator from '../../solidity/artifacts/contracts/EntropyGenerator/EntropyGenerator.sol/EntropyGenerator.json';
import entityMerging from '../../solidity/artifacts/contracts/EntityMerging/EntityMerging.sol/EntityMerging.json';
import nukeFund from '../../solidity/artifacts/contracts/NukeFund/NukeFund.sol/NukeFund.json';


export const contractsConfig = {
  totalSlots: 770,
  valuesPerSlot: 13,
  infuraRPCURL: 'https://sepolia.infura.io/v3/bc15b785e15745beaaea0b9c42ae34fa',
  traitForgeNftAbi: TraitForgeNftAbi.abi,
  traitForgeNftAddress: process.env.NEXT_PUBLIC_TRAITFORGENFT_ADDRESS,
  entropyGeneratorContractAbi: EntropyGenerator.abi,
  entropyGeneratorContractAddress: process.env.NEXT_PUBLIC_ENTROPY_GENERATOR_ADDRESS,
  entityMergingContractAbi: entityMerging.abi,
  entityMergingAddress: process.env.NEXT_PUBLIC_MERGING_CONTRACT_ADDRESS,
  nukeFundContractAbi: nukeFund.abi,
  nukeContractAddress: process.env.NEXT_PUBLIC_NUKE_CONTRACT_ADDRESS,
};
