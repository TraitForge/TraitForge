import { useState, useEffect, useMemo } from 'react';
import { EntityCard, FiltersHeader } from '@/components';

export const WalletEntityModal = ({
  ownerEntities,
  handleSelectedFromWallet,
  handleOwnerEntityList,
}) => {
  const [filteredEntities, setFilteredEntities] = useState([]);
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');

  useEffect(() => {
    const filterEntities = () => {
      try {
        const filtered = ownerEntities.filter(
          entity => entity.role === 'Merger'
        );
        setFilteredEntities(filtered);
      } catch (error) {
        console.error('Error in filterEntities:', error);
      }
    };

    filterEntities();
  }, [ownerEntities]);

  const handleFilterChange = (selectedOption, type) => {
    if (type === 'generation') {
      setGenerationFilter(selectedOption.value);
    } else if (type === 'sorting') {
      setSortingFilter(selectedOption.value);
    }
  };

  const filteredListings = useMemo(() => {
    let filtered = filteredEntities.filter(listing => {
      if (
        generationFilter &&
        String(listing.generation) !== String(generationFilter)
      ) {
        return false;
      }
      return true;
    });

    if (sortingFilter === 'NukeFactor_low_to_high') {
      filtered.sort(
        (a, b) => parseFloat(a.nukeFactor) - parseFloat(b.nukeFactor)
      );
    } else if (sortingFilter === 'NukeFactor_high_to_low') {
      filtered.sort(
        (a, b) => parseFloat(b.nukeFactor) - parseFloat(a.nukeFactor)
      );
    }

    return filtered;
  }, [generationFilter, sortingFilter, filteredEntities]);

  return (
    <div className="bg-dark-81 md:w-[90vw] h-[100vh] md:h-[90vh] 2xl:w-[80vw] md:rounded-[30px] py-10 px-5 flex flex-col">
      <div className="border-b border-white mb-10">
        <h3 className="text-center pb-10 text-[40px] uppercase font-bebas-neue">
          Select From Wallet
        </h3>
        <FiltersHeader
          filterOptions={['your mergers']}
          pageType="nuke"
          color="orange"
          handleFilterChange={handleFilterChange}
          generationFilter={generationFilter}
          sortingFilter={sortingFilter}
        />
      </div>
      <div className="flex-1 overflow-y-scroll">
        <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-5 gap-x-2 md:gap-x-[15px] gap-y-7 md:gap-y-10">
          {filteredListings.map(entity => (
            <EntityCard
              key={entity.tokenId}
              entity={entity}
              borderType="orange"
              onSelect={() => {
                handleSelectedFromWallet(entity);
                handleOwnerEntityList();
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
