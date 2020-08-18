import React from 'react';
import './App.scss';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import GraphContainer from './components/GraphContainer/GraphContainer';

function App() {
  return (
    <div >
      <Header/>
      <GraphContainer />
      <Footer />
    </div>
  );
}

export default App;
