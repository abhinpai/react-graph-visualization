import React from 'react';
import ConfigurePane from '../ConfigurePane/ConfigurePane';
import InspectorPane from '../InspectorPane/InspectorPane';
import data from '../../resources/100.json';
import './GraphContainer.scss';
import GraphView from '../GraphView/GraphView';

function GraphContainer() {
  return (
    <div className='graphContainer'>
      <ConfigurePane />
      <div className='graphContainer__graph'>
        <GraphView graphData={data}/>
      </div>
      <InspectorPane />
    </div>
  );
}

export default GraphContainer;
