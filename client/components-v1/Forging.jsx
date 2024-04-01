import React, { useState, useEffect, useRef } from 'react';
import { ethers } from 'ethers';
import {
  useWeb3ModalAccount,
  useWeb3ModalProvider,
} from '@web3modal/ethers5/react';
import Modal from './ForgingModal';
import OwnerEntitiesModal from './OwnerEntities';
import ClaimEntity from '../utils/claimentity.png';
import PoolForgeCard from '../utils/PoolSelectCard.png';
import WalletForgeCard from '../utils/WalletSelectCard.png';
import ForgeButton from '../utils/forgebutton.png';
import '../styles/Forging.css';
import LoadingSpinner from './Spinner';
import ForgeContractAbi from '../artifacts/contracts/EntityMerging.sol/EntityMerging.json';

const ForgeContractAddress = '0xa513E6E4b8f2a923D98304ec87F64353C4D5C853';

const EntityList = ({ entities, onEntitySelect }) => (
  <div className="breeder-items-list">
    {entities.map(entity => (
      <div
        className="card"
        key={entity.id}
        onClick={() => onEntitySelect(entity)}
      >
        <img
          className="cards-img"
          src={entity.image}
          alt={`Entity ${entity.title}`}
        />
        <h5>{entity.title}</h5>
        <p>Price: {entity.price} ETH</p>
        <p>Gender: {entity.gender}</p>
        <p>Nuke Factor: {entity.nukeFactor}</p>
        <p>Breed Potential: {entity.breedPotential}</p>
        <p>Performance Factor: {entity.performanceFactor}</p>
        <p>Is Sire: {entity.isSire ? 'Yes' : 'No'}</p>
      </div>
    ))}
  </div>
);

const ProcessingModal = ({ processing, text }) => {
  if (!processing) return null;
  return (
    <div className="processing-modal">
      <div className="modal-content">
        <LoadingSpinner />
        <p>{text}</p>
      </div>
    </div>
  );
};

const NFTListings = () => {
  const { isConnected } = useWeb3ModalAccount();
  const { walletProvider } = useWeb3ModalProvider();
  const entityList = useRef(null);
  const [entitiesForForging, setEntitiesForForging] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [openOwnerEntitiesModal, setOpenOwnerEntitiesModal] = useState(false);
  const [sortOption, setSortOption] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [processingText, setProcessingText] = useState('Forging');

  useEffect(() => {
    const fetchEntities = async () => {
      if (!isConnected) return;
      try {
        const provider = new ethers.providers.Web3Provider(walletProvider);
        const contract = new ethers.Contract(
          ForgeContractAddress,
          ForgeContractAbi,
          provider
        );
        const data = await contract.fetchEntitiesForForging();
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
    fetchEntities();
  }, [isConnected, walletProvider]);

  const getSortedEntities = () => {
    if (!sortOption) return entitiesForForging;
    return entitiesForForging.sort((a, b) => {
      if (sortOption === 'priceLowHigh') {
        return parseFloat(a.price) - parseFloat(b.price);
      } else if (sortOption === 'priceHighLow') {
        return parseFloat(b.price) - parseFloat(a.price);
      }
      return 0;
    });
  };

  const sortedEntities = getSortedEntities();

  const openEntityToForge = entity => {
    setSelectedEntity(entity);
  };

  const toggleOwnerEntitiesModal = () => {
    console.log('Toggling OwnerEntitiesModal');
    setOpenOwnerEntitiesModal(true);
  };

  const scrollToEntityList = () => {
    entityList.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const forgeNewEntity = async () => {
    if (!isConnected) return;
    setProcessing(true);
    setProcessingText('Forging');
    try {
      const ethersProvider = new ethers.providers.Web3Provider(walletProvider);
      const signer = await ethersProvider.getSigner();
      const forgeContract = new ethers.Contract(
        ForgeContractAddress,
        ForgeContractAbi.abi,
        signer
      );
      const transaction = await forgeContract.forgeEntity();
      await transaction.wait();

      setTimeout(() => {
        setProcessingText('Merging');
        setTimeout(() => {
          setProcessing(false);
          console.log('Process completed');
        }, 10000);
      }, 10000);
      console.log('Forged successfully');
    } catch (error) {
      console.error('Failed to fetch entities:', error);
    }
  };

  return (
    <div className="TBG-page">
      <div className="forge-arena-container">
        <h1>Forging Arena</h1>
        <div className="selected-entity-placeholder">
          <div className="forgecardsrow">
            <img
              src={PoolForgeCard}
              alt="forge place holder"
              className="other-entities"
              onClick={scrollToEntityList}
            />
            <img src={ClaimEntity} alt="claim box" />
            <img
              src={WalletForgeCard}
              alt="forge place holder"
              className="your-entities"
              onClick={toggleOwnerEntitiesModal}
            />
            {openOwnerEntitiesModal && (
              <OwnerEntitiesModal
                isOpen={openOwnerEntitiesModal}
                onClose={() => setOpenOwnerEntitiesModal(false)}
              />
            )}
          </div>
          {selectedEntity && (
            <div className="selectedEntity">
              <img
                src={selectedEntity.image}
                alt={`Entity ${selectedEntity.title}`}
              />
              <div>
                <h5>{selectedEntity.title}</h5>
                <p>Price: {selectedEntity.price} ETH</p>
                <p>Gender: {selectedEntity.gender}</p>
              </div>
            </div>
          )}
        </div>
        <img
          src={ForgeButton}
          alt="forge"
          className="forge-button"
          onClick={() => forgeNewEntity()}
        />
      </div>

      <div className="entity-list-container" ref={entityList}>
        <div className="breed-sorting-options">
          <div className="left-items">
            {openModal && (
              <Modal open={openModal} onClose={() => setOpenModal(false)} />
            )}
            <button
              className="breed-entity-button"
              onClick={() => setOpenModal(true)}
            >
              List Your Forger
            </button>
          </div>
          <div className="right-items">
            <select
              className="forge-sorting-dropdown"
              onChange={e => setSortOption(e.target.value)}
            >
              <option value="">Select Sorting Option</option>
              <option value="priceLowHigh">Price: Low to High</option>
              <option value="priceHighLow">Price: High to Low</option>
            </select>
          </div>
        </div>
        <EntityList
          entities={sortedEntities}
          openSelectEntity={openEntityToForge}
        />
      </div>

      {selectedEntity && (
        <div className="detailed-card">
          <img
            src={selectedEntity.image}
            alt={`Entity ${selectedEntity.title}`}
          />
          <h5>{selectedEntity.title}</h5>
          <p>Price: {selectedEntity.price} ETH</p>
          <p>{selectedEntity.gender}</p>
          <p>Nuke Factor: {selectedEntity.nukefactor}</p>
          <button
            className="forge-button"
            onClick={() => forgeNewEntity(selectedEntity)}
          >
            Forge
          </button>
          <button
            className="close-button"
            onClick={() => setSelectedEntity(null)}
          >
            Close
          </button>
          <ProcessingModal processing={processing} text={processingText} />
        </div>
      )}
    </div>
  );
};

export default NFTListings;
