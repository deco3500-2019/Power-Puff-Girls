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
        return (
            <div className="profile">
                <h1>Profile</h1>
                <img src={picture} alt="Sometext" />
                <div className="pieChart">
                    {thrown === '' || used === '' ? 'Loading...' :
                        <PieChart
                            data={[
                                { title: 'Thrown', value: thrown, color: '#F28123' },
                                { title: 'Used', value: used, color: '#FFC971' },
                            ]}
                            label
                            labelPosition={112}
                            labelStyle={{
                                fill: '#121212',
                                fontFamily: 'sans-serif',
                                fontSize: '10px'
                            }}
                            lineWidth={30}
                            style={{
                                height: '200px'
                              }}
                        />}
                </div>
                <div className="stats">
                    Used: {used}
                    <hr />
                    Trown: {thrown}
                </div>
                {/* Needs css */}
                
                <button type="button" onClick={this.logOut} className="logOutButton">Log out</button>
            </div>
        )
    }
}

export default Profile;