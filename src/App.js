import React from 'react';
import './App.scss';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import GraphView from './components/GraphView/GraphView';

function App() {
  return (
    <div >
      <Header />
      
      <GraphView />
      <Footer />
    </div>
  );
}

export default App;
