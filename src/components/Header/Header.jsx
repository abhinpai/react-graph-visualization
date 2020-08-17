import React from 'react';
import './Header.scss';

function Header() {
  return (
    <div className='header'>
      <h2>Graph Visualizer</h2>
      <input type='text' placeholder='Search node' />
    </div>
  );
}

export default Header;
