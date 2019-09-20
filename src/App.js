import React from 'react';
import logo from './logo.svg';
import './App.css';

/* This is the starting page!! */

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <img src={logo} className="App-logo" alt="logo" /> */}
        <p>
          <TestComponent testProp="Tuva"/>
          Welcome to the food waste app!
          <Test2 />
        </p>
      </header>
    </div>
  );
}

export default App;



class TestComponent extends React.Component{
  render(){
    return <h1>Test! {this.props.testProp}</h1>
  }
}

const Test2 = () => {
  return <h1>Test2</h1>
}
