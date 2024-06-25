import React, { useState, useMemo } from 'react';
import { EntityCard, FiltersHeader } from '@/components';

export const SelectEntityList = ({ entitiesForForging, handleSelectedFromPool, handleEntityListModal }) => {
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');

  const handleFilterChange = (selectedOption, type) => {
    if (type === 'generation') {
      setGenerationFilter(selectedOption.value);
    } else if (type === 'sorting') {
      setSortingFilter(selectedOption.value);
    }
  };

  const filteredAndSortedListings = useMemo(() => {
    let filtered = entitiesForForging.filter(listing => {
      if (!listing.isListed === true) return false;
      if (generationFilter && String(listing.generation) !== String(generationFilter)) {
        return false;
      }
      return true;
    });

    if (sortingFilter === 'price_low_to_high') {
      filtered.sort((a, b) => parseFloat(a.fee) - parseFloat(b.fee));
    } else if (sortingFilter === 'price_high_to_low') {
      filtered.sort((a, b) => parseFloat(b.fee) - parseFloat(a.fee));
    }

    return filtered;
  }, [generationFilter, sortingFilter, entitiesForForging]);

  return (
    <div className="bg-dark-81 w-[95vw] md:w-[80vw] h-[100vh] md:h-[85vh] 2xl:w-[70vw] md:rounded-[30px] mx-auto py-10 px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h2 className="text-center pb-10 text-[40px] uppercase ">Select From Pool</h2>
        <FiltersHeader
          filterOptions={['Listed forgers']}
          color="orange"
          handleFilterChange={(selectedOption, type) => handleFilterChange(selectedOption, type)}
          generationFilter={generationFilter}
          sortingFilter={sortingFilter}
        />
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-x-[15px] gap-y-7 md:gap-y-10">
          {filteredAndSortedListings.map(listing => (
            <EntityCard
              key={listing.tokenId}
              entity={listing}
              borderType="orange"
              price={listing.fee}
              onSelect={() => {
                handleSelectedFromPool(listing);
                handleEntityListModal();
              }}
              showPrice
            />
          ))}
        </div>
      </div>
    </div>
  );
};
