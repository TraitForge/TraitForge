import Image from 'next/image';
import classNames from 'classnames';

import { EntityCard } from '@/components';

export const ArenaItem = ({
  handleOwnerEntityList,
  image,
  selectedFromWallet,
  btnLabel,
  className,
}) => {
  if (selectedFromWallet)
    return (
      <EntityCard
        handleOwnerEntityList={handleOwnerEntityList}
        entity={selectedFromWallet}
        borderType="orange"
      />
    );

  const buttonWrapper = classNames('flex flex-col gap-y-5', className);

  return (
    <div className={buttonWrapper}>
      <button
        aria-label={btnLabel}
        className="items-center justify-center cursor-pointer h-auto"
        onClick={handleOwnerEntityList}
      >
        <Image
          src={image}
          alt="forge place holder"
          width={700}
          height={700}
          className="w-full h-full hidden md:block"
        />
        <Image
          src="/images/walletSelectCardSm.png"
          alt="forge place holder"
          width={600}
          height={600}
          className="w-full h-full block md:hidden"
        />
      </button>
    </div>
  );
};
