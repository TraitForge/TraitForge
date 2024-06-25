import Image from 'next/image';
import classNames from 'classnames';

import { EntityCard } from '@/components';

export const ArenaItemForger = ({
  handleEntityListModal,
  image,
  selectedFromPool,
  btnLabel,
  className,
}) => {
  if (selectedFromPool)
    return <EntityCard entity={selectedFromPool} borderType="orange" />;

  const buttonWrapper = classNames('flex flex-col gap-y-5', className);

  return (
    <div className={buttonWrapper}>
      <button
        aria-label={btnLabel}
        className="items-center justify-center cursor-pointer h-auto"
        onClick={handleEntityListModal}
      >
        <Image
          src={image}
          alt="forge place holder"
          width={700}
          height={800}
          className="w-full h-full hidden md:block"
        />
        <Image
          src="/images/poolSelectedCardSm.png"
          alt="forge place holder"
          width={600}
          height={600}
          className="w-full h-full block md:hidden"
        />
      </button>
    </div>
  );
};
