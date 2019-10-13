import React from 'react';
import './Login.css';
import { Link } from 'react-router-dom';
import App from '../App';
import * as fb from './../server.js'

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            redirect: false,
            username: '',
            password: '',
            responseMessage: ''
        }
        this.login = this.login.bind(this);
        this.type = this.type.bind(this);
    }
    login(event) {
        event.preventDefault();
        fb.login(this.state.username, this.state.password).then((result) => {
            if (result.success) {
                sessionStorage.setItem('foodWaste-loggedIn', 'true');
                this.setState({ redirect: true })
            }
            else {
                this.setState({
                    responseMessage: result.message
                });
            }
        })
    }

    type(event) {
        const inputName = event.target.name;
        const value = event.target.value;
        this.setState({
            [inputName]: value
        })
    }

    render() {
        let { username, password } = this.state;
        if (this.state.redirect) {
            return <App />
        }
        return (
            <form className="body">
                <h1>Login</h1>
                <div>{this.state.responseMessage}</div>
                <div className="inputBox">
                    <input type="text" name='username' placeholder="Username" className="loginInput"
                        value={username} onChange={this.type} />
                </div>
                <div>
                    <input type="password" name='password' placeholder="Password" className="loginInput"
                        value={password} onChange={this.type} />
                </div>
                <button type="submit" onClick={this.login} className="menuItem">Log In</button>
                <Link to="/login" className="menuItem">Sign up</Link>
            </form>
        )
    }
}

export default Login;

