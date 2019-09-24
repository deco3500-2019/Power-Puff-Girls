import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';

class Login extends React.Component {
    render() {
        return (
            <div className="body">
                <h1>Login</h1>
                <div className="inputBox">
                    <input type="text" placeholder="Username" className="loginInput" />
                </div>
                <div>
                    <input type="password" placeholder="Password" className="loginInput" />
                </div>
                <Link to="/profile" className="menuItem">Log In</Link>
                <Link to="/login" className="menuItem">Sign up</Link>
            </div>
        )
    }
}

export default Login;