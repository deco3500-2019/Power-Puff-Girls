import React from 'react';

class Fridge extends React.Component {
    constructor(){
        super();
        this.state = {
            UserName: 'admin',
            UserPassword: 'admin'
        }
    }
    render() {
        return (<div>
            <h1>Fridge</h1>
        </div>
        )
    }
}

export default Fridge;

