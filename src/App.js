import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import Profile from './Profile/Profile';
import Inventory from './InventoryList/Inventory';
import GroceryList from './GroceryList/GroceryList';
import Login from './Login/Login';

function App() {
  return (
    <BrowserRouter>
      {sessionStorage.getItem('foodWaste-loggedIn') === 'true' ?
        <div className="App">
          <Switch>
            <Route path="/inventory" component={Inventory} />
            <Route path="/profile" component={Profile} />
            <Route path="/groceryList" component={GroceryList} />
            <Route path="/" render={() => (<Redirect to="/inventory" />)} />
          </Switch>
          <div className="menu">
            <Link to="/inventory" className="menuItem">Inventory</Link>
            <Link to="/groceryList" className="menuItem">Grocery List</Link>
            <Link to="/profile" className="menuItem">Profile</Link>
          </div>
        </div>
        :
        <Login />}
    </BrowserRouter>
  );
}

export default App;
