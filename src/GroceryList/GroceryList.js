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
                {loading ? 'Loading...' :
                    <ul className="groceryList">
                        {groceryList.map(item => {
                            return <li><input type="checkbox"key={item.id} className="groceyItem" value={item.name}/>{item.name} <div className="itemQuantity">{item.quantity}x</div></li>
                            
                        })}
                    </ul>}
                    <button type="button" name="Purchase" className="purchase">Purchase</button>
                    <button type="button" name="Delete" className="delete">Delete</button>
            </div>
        )
    }
}

export default GroceryList;