import React, { Component } from 'react';
import './App.css';
import MyComponent from './components/SomeComponent';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">
            Remx Example
          </h1>
        </header>
        <MyComponent/>
      </div>
    );
  }
}

export default App;
