import React from 'react';
import './App.css';
import { BrowserRouter, Route, Switch, Link, Redirect } from 'react-router-dom';
import Profile from './Profile/Profile';
import Fridge from './FridgeList/Fridge';
import GroceryList from './GroceryList/GroceryList';
import Login from './Login/Login';

function App() {
  return (
    <BrowserRouter>
      {sessionStorage.getItem('foodWaste-loggedIn') === 'true' ?
        <div className="App">
          <Switch>
            <Route path="/profile" component={Profile} />
            <Route path="/fridge" component={Fridge} />
            <Route path="/groceryList" component={GroceryList} />
            <Route path="/" render={() => (<Redirect to="/fridge" />)} />
          </Switch>
          <div className="menu">
            <Link to="/fridge" className="menuItem">Fridge</Link>
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
