import React from 'react';
import "./Profile.css";
import PieChart from 'react-minimal-pie-chart';

class Profile extends React.Component{
    logOut(){
        sessionStorage.setItem('foodWaste-loggedIn', 'false');
        window.location.reload();
    }
    render(){
        return (
            <div>
                <h1>Profile</h1>
                <div className="pieChart">
                    <PieChart
                    data={[
                        { title: 'Thrown', value: 10, color: '#EE6352' },
                        { title: 'Used', value: 15, color: '#7FB069' },
                    ]}
                    />
                    Here comes some stats
                </div>
                <button type="button" onClick={this.logOut} className="logOutButton">Log out</button>
            </div>
        )
    }
}

export default Profile;