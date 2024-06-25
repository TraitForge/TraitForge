import React, { useState, useEffect } from 'react';

import { useContextState } from '@/utils/context';
import { StatsNavbar } from '@/screens/game-stats/StatsNavbar';
import { StatisticsList } from '@/screens/game-stats/StatisticsList';

const Stats = () => {
  const { subscribeToMintEvent } = useContextState();
  const [currentStat, setCurrentStat] = useState('addressWithMostEntities');
  const [stats, setStats] = useState({
    addressWithMostEntities: [],
    highestTotalEntropy: [],
    mostForges: [],
  });

  useEffect(() => {
    const fetchStats = async () => {
      const data = await getStatsFromAPI();
      setStats(data);
    };
    fetchStats();
  }, []);

  return (
    <div className="page-container">
      <div className="md:container h-full md:pb-10">
        <div className="md:bg-dark-81 rounded-[30px] flex flex-col h-full md:p-10">
          <h1 className="text-[40px] mb-10">Statistics</h1>
          <StatsNavbar handleCurrentStats={stat => setCurrentStat(stat)} currentStat={currentStat} />
          <StatisticsList currentStat={currentStat} stats={stats} />
        </div>
      </div>
    </div>
  );
};

async function getStatsFromAPI() {
  return new Promise(resolve =>
    setTimeout(
      () =>
        resolve({
          highestTotalEntropy: [
            { address: '0x12e379a83939874d002uv03', value: '000000000' },
            { address: '0x24f479b84939874d003uv04', value: '000000000' },
            { address: '0x35g569c95939874d004uv05', value: '000000000' },
            { address: '0x46h679d06939874d005uv06', value: '000000000' },
            { address: '0x57i789e17939874d006uv07', value: '000000000' },
            { address: '0x12e379a83939874d002uv03', value: '000000000' },
            { address: '0x24f479b84939874d003uv04', value: '000000000' },
            { address: '0x35g569c95939874d004uv05', value: '000000000' },
            { address: '0x46h679d06939874d005uv06', value: '000000000' },
            { address: '0x57i789e17939874d006uv07', value: '000000000' },
          ],
          mostForges: [
            {
              address: '0x11d299her378493dy4983',
              value: '(16 Breeds over 3 Years)',
            },
            {
              address: '0x22e3aajsi48493fy5984',
              value: '(14 Breeds over 2 Years)',
            },
            {
              address: '0x33f4bbktj59493gz6985',
              value: '(12 Breeds over 4 Years)',
            },
            {
              address: '0x44g5ccluk60493ha7986',
              value: '(10 Breeds over 5 Years)',
            },
            {
              address: '0x55h6ddmvn71493ib8987',
              value: '(8 Breeds over 1 Year)',
            },
            {
              address: '0x11d299her378493dy4983',
              value: '(16 Breeds over 3 Years)',
            },
            {
              address: '0x22e3aajsi48493fy5984',
              value: '(14 Breeds over 2 Years)',
            },
            {
              address: '0x33f4bbktj59493gz6985',
              value: '(12 Breeds over 4 Years)',
            },
            {
              address: '0x44g5ccluk60493ha7986',
              value: '(10 Breeds over 5 Years)',
            },
            {
              address: '0x55h6ddmvn71493ib8987',
              value: '(8 Breeds over 1 Year)',
            },
          ],

          addressWithMostEntities: [
            {
              address: '0x4568347h8364ff48h3822',
              value: 230,
            },
            {
              address: '0x5679458i9475gg59i4933',
              value: 215,
            },
            {
              address: '0x678a569j0586hh6aj5044',
              value: 200,
            },
            {
              address: '0x789b67ak1697ii7bk6155',
              value: 185,
            },
            {
              address: '0x89ac78bl27a8jj8cl7266',
              value: 170,
            },
            {
              address: '0x4568347h8364ff48h3822',
              value: 230,
            },
            {
              address: '0x5679458i9475gg59i4933',
              value: 215,
            },
            {
              address: '0x678a569j0586hh6aj5044',
              value: 200,
            },
            {
              address: '0x789b67ak1697ii7bk6155',
              value: 185,
            },
            {
              address: '0x89ac78bl27a8jj8cl7266',
              value: 170,
            },
          ],
        }),
      1000
    )
  );
}

export default Stats;
