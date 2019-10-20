import React from 'react';
import "./Profile.css";
import PieChart from 'react-minimal-pie-chart';
import * as fb from '../server.js';


class Profile extends React.Component {
    constructor() {
        super();
        this.state = ({
            picture: '',
            thrown: '',
            used: ''
        })

        fb.getProfilePic().then(pic => {
            console.log(pic);
            this.setState({
                picture: pic
            })
        })
        fb.getThrownUsed().then(result => {
            this.setState({
                thrown: result.thrown,
                used: result.used
            })
        })
    }
    logOut() {
        sessionStorage.setItem('foodWaste-loggedIn', 'false');
        window.location.reload();
    }
    render() {
        const { picture, thrown, used } = this.state;
        console.log(thrown, used); //Thrown and used data. Might have to be converted to number to be used in the piechart?
        return (
            <div>
                <h1>Profile</h1>
                <div className="pieChart">
                    {thrown === '' || used === '' ? 'Loading...' :
                        <PieChart
                            data={[
                                { title: 'Thrown', value: 10, color: '#EE6352' },
                                { title: 'Used', value: 2, color: '#7FB069' },
                            ]}
                        />
                    }
                    Here comes some stats
                </div>
                {/* Needs css */}
                <img src={picture} alt="Sometext" />
                <button type="button" onClick={this.logOut} className="logOutButton">Log out</button>
            </div>
        )
    }
}

export default Profile;