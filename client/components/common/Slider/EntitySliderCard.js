import React, { useState } from 'react';
import Image from 'next/image';
import classNames from 'classnames';
import Skeleton from 'react-loading-skeleton';

import { calculateEntityAttributes } from '@/utils/utils';
import styles from './styles.module.scss';
import blueBorder from '@/public/images/border.svg';

export const EntitySliderCard = ({ entropy, price, wrapperClass, showPrice, currentGeneration }) => {
  const [imgLoaded, setImgLoaded] = useState(null);
  const paddedEntropy = entropy.toString().padStart(6, '0');
  const generation = currentGeneration?.toString();
  const calculateUri = (paddedEntropy, generation) => {
    return `${paddedEntropy}_${generation}`;
  };
  const uri = calculateUri(paddedEntropy, generation);

  const { role, forgePotential, performanceFactor, nukeFactor } = calculateEntityAttributes(paddedEntropy);

  const wrapperClasses = classNames(
    'mx-5 overflow-hidden items-center min-h-[300px] w-full 3xl:min-h-[400px]',
    styles.cardContainer,
    wrapperClass
  );

  const borderStyles = {
    borderWidth: '15px', // Set the border width to match the border image slice value
    borderStyle: 'solid', // Ensure a border style is set
    borderColor: 'transparent', // To avoid conflicts with borderColor, set it to transparent
    borderImage: `url("${blueBorder.src}") 15 stretch`,
  };

  const imageUrl = `https://traitforge.s3.ap-southeast-2.amazonaws.com/${uri}.jpeg`;

  return (
    <div className={wrapperClasses} style={borderStyles}>
      <div className="mb-4 h-full w-full">
        {/* {!imgLoaded ? (
          <Skeleton width="100%" height={170} />
        ) : ( */}
        <Image
          loading="lazy"
          src={imageUrl}
          alt="IMG"
          className="w-full max-h-[170px] md:max-h-[310px]"
          width={250}
          height={250}
          onLoad={e => setImgLoaded(e.target.naturalWidth)}
        />
        {/* )} */}
      </div>
      <div className="mt-5 mb-5 h-full text-center text-sm md:text-[18px]">
        <div className={styles.cardInfo}>
          <h3 className="card-name"> GEN{currentGeneration}</h3>
          {showPrice && <h4 className="">{price} ETH</h4>}
        </div>
        <div className="text-[14px] md:text-base 3xl:text-[18px] !font-electrolize">
          {/* {!imgLoaded ? (
            <Skeleton width="100%" count={4} />
          ) : (
            <> */}
          <p>{role}</p>
          <p>Forge Potential: {forgePotential}</p>
          <p>Nuke Factor: {nukeFactor} %</p>
          <p>Performance Factor: {performanceFactor}</p>
          {/* </>
          )} */}
        </div>
      </div>
    </div>
  );
};
