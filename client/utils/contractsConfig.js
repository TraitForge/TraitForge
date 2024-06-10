import TraitForgeNftAbi from '../../smart-contracts/artifacts/contracts/TraitForgeNft/TraitForgeNft.sol/TraitForgeNft.json';
import EntropyGenerator from '../../smart-contracts/artifacts/contracts/EntropyGenerator/EntropyGenerator.sol/EntropyGenerator.json';
import entityMerging from '../../smart-contracts/artifacts/contracts/EntityForging/EntityForging.sol/EntityForging.json';
import entityTrading from '../../smart-contracts/artifacts/contracts/entityTrading/entityTrading.sol/entityTrading.json';
import nukeFund from '../../smart-contracts/artifacts/contracts/NukeFund/NukeFund.sol/NukeFund.json';

export const contractsConfig = {
  totalSlots: 770,
  valuesPerSlot: 13,
  infuraRPCURL: process.env.NEXT_PUBLIC_ALCHEMY_RPCURL,
  traitForgeNftAbi: TraitForgeNftAbi.abi,
  traitForgeNftAddress: process.env.NEXT_PUBLIC_TRAITFORGENFT_ADDRESS,
  entropyGeneratorContractAbi: EntropyGenerator.abi,
  entropyGeneratorContractAddress:
    process.env.NEXT_PUBLIC_ENTROPY_GENERATOR_ADDRESS,
  entityTradingContractAddress: process.env.NEXT_PUBLIC_TRADING_ADDRESS,
  entityTradingAbi: entityTrading.abi,
  entityMergingContractAbi: entityMerging.abi,
  entityMergingAddress: process.env.NEXT_PUBLIC_MERGING_CONTRACT_ADDRESS,
  nukeFundContractAbi: nukeFund.abi,
  nukeContractAddress: process.env.NEXT_PUBLIC_NUKE_CONTRACT_ADDRESS,
};
