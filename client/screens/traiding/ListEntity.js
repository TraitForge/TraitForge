import { EntityCard, FiltersHeader } from '@/components';
import { useState, useMemo } from 'react';

export const ListEntity = ({ ownerEntities, setSelectedForSale, handleStep }) => {
  const [sortOption, setSortOption] = useState('all');
  const [generationFilter, setGenerationFilter] = useState('');
  const [sortingFilter, setSortingFilter] = useState('');

  const handleSort = type => setSortOption(type);

  const handleFilterChange = (selectedOption, type) => {
    if (type === 'generation') {
      setGenerationFilter(selectedOption.value);
    } else if (type === 'sorting') {
      setSortingFilter(selectedOption.value);
    }
  };

  const filteredAndSortedOwnerEntities = useMemo(() => {
    let filtered = ownerEntities.filter(listing => {
      if (generationFilter && String(listing.generation) !== String(generationFilter)) {
        return false;
      }

      if (sortOption === 'all') return true;
      if (sortOption === 'forgers') return listing.role === 'Forger';
      if (sortOption === 'mergers') return listing.role === 'Merger';
      return true;
    });

    if (sortingFilter === 'NukeFactor_low_to_high') {
      filtered.sort((a, b) => parseFloat(a.nukeFactor) - parseFloat(b.nukeFactor));
    } else if (sortingFilter === 'NukeFactor_high_to_low') {
      filtered.sort((a, b) => parseFloat(b.nukeFactor) - parseFloat(a.nukeFactor));
    }

    return filtered;
  }, [sortOption, generationFilter, sortingFilter, ownerEntities]);

  return (
    <div className="overflow-y-auto flex-1">
      <FiltersHeader
        sortOption={sortOption}
        handleSort={handleSort}
        pageType="nuke"
        color="green"
        handleFilterChange={handleFilterChange}
        generationFilter={generationFilter}
        sortingFilter={sortingFilter}
      />
      <div className="grid grid-cols-3 lg:grid-cols-5 mt-10 gap-x-3  md:gap-x-[15px] gap-y-7 lg:gap-y-10">
        {filteredAndSortedOwnerEntities.map(entity => (
          <EntityCard
            key={entity.tokenId}
            entity={entity}
            borderType="green"
            onSelect={() => {
              setSelectedForSale(entity);
              handleStep('three');
              console.log('Selected entity:', entity);
            }}
          />
        ))}
      </div>
    </div>
  );
};
