import React from 'react';
import './GraphView.scss';

function GraphView({graphData}) {
    console.log(graphData);
  return <div className=''>
      <h2>Nodes:{graphData.nodes.length}</h2>
      <h2>Edges:{graphData.edges.length}</h2>
  </div>;
}

export default GraphView;
