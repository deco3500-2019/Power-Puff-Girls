import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Profile from './Profile/Profile';
import Fridge from './FridgeList/Fridge';
import GroceryList from './GroceryList/GroceryList';
import Login from './Login/Login';

/* This is the starting page!! */

function App() {
  return (<BrowserRouter>
    <div className="App">
      <Switch>
        <Route path="/profile" component={Profile} />
        <Route path="/fridge" component={Fridge}/>
        <Route path="/groceryList" component={GroceryList}/>
        <Route path="/login" component={Login}/>
      </Switch>
      <div className="menu">
        <Link to="/fridge" className="menuItem">Fridge</Link>
        <Link to="/groceryList" className="menuItem">Grocery List</Link>
        <Link to="/profile" className="menuItem">Profile</Link>
      </div>
    </div>
  </BrowserRouter>
  );
}

export default App;
