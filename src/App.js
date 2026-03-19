import React from 'react';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Cheki Events - Riara University</h1>
        <p>Student Event Ticketing System</p>
        <div className="event-card">
          <h2>Nairobi Jazz Night</h2>
          <p>Experience an unforgettable evening of live jazz music</p>
          <p>Date: March 15, 2026</p>
          <p>Price: KES 1,500</p>
          <button>Get Tickets</button>
        </div>
        <div className="event-card">
          <h2>Contemporary Art Exhibition</h2>
          <p>Explore thought-provoking contemporary art pieces</p>
          <p>Date: March 20, 2026</p>
          <p>Price: KES 500</p>
          <button>Get Tickets</button>
        </div>
      </header>
    </div>
  );
}

export default App;
