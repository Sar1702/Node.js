import React from 'react';
import Header from './components/Header';
import Home from './pages/Home';

const App = () => {
  return (
    <div className="min-h-screen bg-[#f6f6fc] flex flex-col items-center py-10 px-4">
      <Header />
      <Home />
    </div>
  );
};

export default App;
