import React from 'react';
import "./Profile.css";

class Profile extends React.Component{
    logOut(){
        sessionStorage.setItem('foodWaste-loggedIn', 'false');
        window.location.reload();
    }
    render(){
        return (
            <div>
                <h1>Profile</h1>
                <div>
                    Here comes some stats
                </div>
                <button type="button" onClick={this.logOut} className="logOutButton">Log out</button>
            </div>
        )
    }
}

export default Profile;