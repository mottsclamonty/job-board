import React, { useState } from 'react';
import ChartsContainerWrapper from '../assets/wrappers/ChartsContainerWrapper';
import BarGraph from './BarGraph';
import AreaGraph from './AreaGraph';
import { useAppContext } from '../context/appContext';

const ChartsContainer = () => {
  const [barChart, setBarChart] = useState(true);
  const { monthlyApplications } = useAppContext();
  return (
    <ChartsContainerWrapper>
      <h4>Monthly Applications</h4>
      <button type="button" onClick={() => setBarChart(!barChart)}>
        Click to show as {!barChart ? 'bar chart' : 'area chart'}
      </button>
      {barChart ? (
        <BarGraph data={monthlyApplications} />
      ) : (
        <AreaGraph data={monthlyApplications} />
      )}
    </ChartsContainerWrapper>
  );
};

export default ChartsContainer;
