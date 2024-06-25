import Image from 'next/image';
import { FaWallet } from 'react-icons/fa';
import { useWeb3ModalAccount } from '@web3modal/ethers/react';
import { useState } from 'react';
import classNames from 'classnames';
import { useRouter } from 'next/router';

import { Button, EntityCard, Modal } from '@/components';
import { shortenAddress } from '@/utils/utils';
import { useContextState } from '@/utils/context';

export const WalletModal = ({ isOpen, closeModal, balanceInETH }) => {
  const { ownerEntities, entitiesListedByUser } = useContextState();
  const { asPath } = useRouter();
  const { address } = useWeb3ModalAccount();
  const [selectedForUnlisting, setSelectedForUnlisting] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);

  const shortAddress = shortenAddress(address);

  const handleSelectEntity = tokenId => {
    setSelectedForUnlisting(prevSelected => {
      if (prevSelected.includes(tokenId)) {
        return prevSelected.filter(id => id !== tokenId);
      } else {
        return [...prevSelected, tokenId];
      }
    });
  };

  const containerClasses = classNames('bg-dark-81 flex justify-center items-center border-[5px] rounded-xl', {
    'border-neon-orange': asPath === '/forging',
    'border-neon-green': asPath === '/trading',
    'border-neon-purple': asPath === '/nuke-fund',
    'border-neon-green-yellow': asPath === '/stats',
    'border-primary': asPath === '/',
  });

  let borderType;
  let buttonColor;

  switch (asPath) {
    case '/forging':
      borderType = 'orange';
      buttonColor = '#FD8D26';
      break;
    case '/trading':
      borderType = 'green';
      buttonColor = '#0EEB81';
      break;
    case '/nuke-fund':
      borderType = 'purple';
      buttonColor = '#FC62FF';
      break;
    default:
      borderType = 'blue';
      buttonColor = '#0ADFDB';
  }

  return (
    <Modal isOpen={isOpen} closeModal={closeModal} containerClass={containerClasses}>
      {currentStep === 1 && (
        <div className="flex justify-center items-center flex-col">
          <div className="flex items-center justify-around mt-14 px-[150px] md:pb-[36px] gap-x-[50px]">
            <div className="flex items-center gap-x-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" width="46" height="46" fill="none" viewBox="0 0 46 46">
                <path
                  fill="#FC62FF"
                  fillOpacity="0.4"
                  d="M23 46c12.703 0 23-10.297 23-23S35.703 0 23 0 0 10.297 0 23s10.297 23 23 23z"
                ></path>
                <path fill="#FEC8FF" d="M22.996 30.449L14 25l8.996 13L32 25l-9.004 5.449z"></path>
                <path fill="#FEC8FF" d="M32 23.485L23 29l-9-5.515L23 8l9 15.485z"></path>
                <path
                  fill="#F866FB"
                  fillOpacity="0.96"
                  d="M31.995 23.273l-8.997-4.09V8.343l8.997 14.93zM32 24.978l-9.002 12.679v-7.365L32 24.978zM22.997 19.183v9.407l-8.995-5.317 8.995-4.09z"
                ></path>
                <path fill="#EC3BEF" fillOpacity="0.99" d="M32 23.348L23 29V19l9 4.348z"></path>
              </svg>
              <div>
                <p className="text-neutral-100 text-base">ETH</p>
                <span className="text-white text-large">{balanceInETH}</span>
              </div>
            </div>
            <div className="flex items-center gap-x-2.5">
              <span className="rounded-full w-[46px] flex justify-center items-center h-[46px] bg-[rgba(14,235,129,0.39)]">
                <FaWallet color="#0EEB81" />
              </span>
              <div>
                <p className="text-neutral-100 text-base">Wallet Address</p>
                <span className="text-white text-large">{shortAddress}</span>
              </div>
            </div>
          </div>
          <div className="w-1/2 mx-auto flex justify-center">
            <Button
              bg="#023340"
              borderColor={buttonColor}
              text="Unlist an Entity"
              style={{ marginBottom: '40px' }}
              onClick={() => setCurrentStep(2)}
            />
          </div>
          <div className="w-8/12 pb-5 h-50 overflow-x-scroll flex flex-row md:text-large text-white md:mb-8 gap-x-4">
            {ownerEntities.map(entity => (
              <EntityCard key={entity.tokenId} entity={entity} borderType={borderType} />
            ))}
          </div>
        </div>
      )}
      {currentStep === 2 && (
        <div className="flex justify-center items-center flex-col">
          <h3 className="pt-10 text-[18px] md:text-[36px] pb-3">Unlist</h3>
          <Image src={'/images/border-bottom-line.png'} width={300} height={5} alt="" className="md:mb-[53px]" />
          <div className="overflow-x-scroll w-6/12 h-44 flex flex-row md:text-large text-white md:mb-5">
            {entitiesListedByUser.map(entity => (
              <EntityCard
                key={entity.tokenId}
                entity={entity}
                onSelect={() => handleSelectEntity(entity)}
                borderType="blue"
              />
            ))}
          </div>
          <div className="w-2/12 flex flex-col justify-center gap-3 pb-5">
            <Button bg="#023340" borderColor={buttonColor} text="unlist entity" />
            <Button bg="#023340" borderColor="#0ADFDB" text="Back to Wallet" onClick={() => setCurrentStep(1)} />
          </div>
        </div>
      )}
    </Modal>
  );
};
