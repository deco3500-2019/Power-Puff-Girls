import React from 'react';
import "./GroceryList.css";
import * as fb from '../server';

class GroceryList extends React.Component {
    constructor() {
        super();
        this.state = ({
            groceryList: [], 
            loading: true
        })

        const userId = sessionStorage.getItem('user_id');
        fb.database.ref(`Users/${userId}/groceryList`).on('value', ((list) => {
            let groceryList = list.val();
            let data = [];
            groceryList.forEach((item) => {
                fb.database.ref(`inventory/${item.id}`).once('value').then((groceryItem) => {
                    data = [...data, { ...groceryItem.val(), quantity: item.quantity}];
                }).then(() => {
                    this.setState({
                        groceryList: data,
                        loading: false
                    })
                })
            })
        }))
    }
    render() {
        const { groceryList, loading } = this.state;
        return (
            <div>
                <h1>Grocery List</h1>
                {loading ? 'Loading...' :
                    <ul>
                        {groceryList.map(item => {
                            return <li key={item.id}>{item.name}, quantity: {item.quantity}</li>
                        })}
                    </ul>}
            </div>
        )
    }
}

export default GroceryList;