import React from 'react';
import ConfigurePane from '../ConfigurePane/ConfigurePane';
import InspectorPane from '../InspectorPane/InspectorPane';
import './GraphView.scss';

function GraphView() {
  return (
    <div className='graphView'>
      <ConfigurePane />
      <div className='graphView__graph'>
        {/* <h2>Graph</h2> */}
      </div>
      <InspectorPane />
    </div>
  );
}

export default GraphView;
