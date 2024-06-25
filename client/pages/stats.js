import React, { useState } from 'react';

import { StatsNavbar } from '@/screens/game-stats/StatsNavbar';
import { StatisticsList } from '@/screens/game-stats/StatisticsList';

const Stats = () => {
  const [currentStat, setCurrentStat] = useState('addressWithMostEntities');

  return (
    <div className="page-container">
      <div className="md:container h-full md:pb-10">
        <div className="md:bg-dark-81 rounded-[30px] flex flex-col h-full md:p-10">
          <h1 className="text-[40px] mb-10">Statistics</h1>
          <StatsNavbar
            handleCurrentStats={stat => setCurrentStat(stat)}
            currentStat={currentStat}
          />
          <StatisticsList currentStat={currentStat}/>
        </div>
      </div>
    </div>
  );
};

export default Stats;
