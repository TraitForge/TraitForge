import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

import { EntityCard } from '@/components';
import { ListingHeader } from '@/screens/forging/ListingHeader';

export const ListEntity = ({
  ownerEntities,
  handleStep,
  setSelectedForListing,
}) => {
  const [filteredEntities, setFilteredEntities] = useState([]);

  useEffect(() => {
    const fetchAndFilterEntities = async () => {
      try {
        const filtered = ownerEntities.filter(
          entity => entity.role === 'Forger'
        );
        setFilteredEntities(filtered);
      } catch (error) {
        console.error(error);
        toast.error('Error filtering enitites');
      }
    };

    fetchAndFilterEntities();
  }, [ownerEntities]);

  return (
    <div className="h-full w-full">
      <div className="container pt-10 md:pt-[54px] flex flex-col h-full">
        <ListingHeader handleStep={handleStep} step="two" />
        <div className="grid grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 lg:gap-y-10">
          {filteredEntities?.map(entity => (
            <EntityCard
              key={entity.tokenId}
              entity={entity}
              borderType="orange"
              onSelect={() => {
                setSelectedForListing(entity);
                handleStep('three');
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListEntity;
