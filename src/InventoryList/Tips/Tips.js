import { faThumbsUp, faThumbsDown } from '@fortawesome/free-regular-svg-icons';
import { faChevronLeft, faChevronCircleUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Tips.css';
import * as fb from '../../server.js';
import React from 'react';

class Tips extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            tips: [],
            loading: true,
            comment: '',
            itemName: ''
        })
        const id = props.match.params.itemId;
        fb.database.ref(`inventory/${id}/name`).once('value').then(inventoryName => {
            this.setState({ itemName: inventoryName.val()});
        })
        fb.database.ref(`inventory/${id}/tips`).on('value', (tips) => {
            const tipsList = tips.val();
            let newList = [];
            tipsList.forEach(tip => {
                fb.database.ref(`Users/${tip.userId}`).once('value').then(user => {
                    const userItem = user.val();
                    newList = [...newList, { ...tip, userName: userItem.username, profilepic: userItem.profilepic }];
                }).then(() => {
                    this.setState({
                        tips: newList,
                        loading: false
                    })
                })
            })
        })
        this.submitComment = this.submitComment.bind(this);
        this.type = this.type.bind(this);
        this.goBack = this.goBack.bind(this);
    }
    submitComment() {
        const id = this.props.match.params.itemId;
        const text = this.state.comment;
        const count = this.state.tips.length;
        fb.saveTips(text, id, count).then(() => {
            this.setState({
                comment: ''
            });
        });
    }
    type(event) {
        this.setState({ comment: event.target.value });
    }
    goBack() {
        this.props.history.push(`/inventory`);
    }
    render() {
        const { itemId } = this.props.match.params;
        const { tips, loading, comment, itemName } = this.state;
        return (
            <div>
                <button type="button" onClick={this.goBack}><FontAwesomeIcon icon={faChevronLeft} /></button>
                <h1 className="tipsTitle">Tips</h1>
                <h2 className="tipsName"> {itemName}</h2>
                {loading ? 'Loading...' :
                    <div>

                        <div className="tipsList">
                            {tips.map((tip, index) => {
                                return <section className="tips">
                                    {/* http://mjedesign.net/uq/images/user.jpg */}
                                    <img src={tip.profilepic} alt="Profile Picture"></img>
                                    <div className="userName">{tip.userName}</div>
                                    <div key={index} className="tipsItem">
                                    {tip.text}
                                    <hr />
                                    <button type="button" onClick={() => fb.changeRating({itemId, number: 1, commentId: index})}><FontAwesomeIcon icon={faThumbsUp} /></button>
                                    <button type="button"onClick={() => fb.changeRating({itemId, number: -1, commentId: index})}><FontAwesomeIcon icon={faThumbsDown} /></button>
                                    rating: {tip.rating}
                                    </div>
                                </section>
                            })}
                        </div>

                        <input type="text" placeholder="Write a tip here.." value={comment} onChange={this.type} className="comment"/>
                        <button type="button" onClick={this.submitComment}><FontAwesomeIcon icon={faChevronCircleUp} /></button>
                    </div>
                }
            </div>
        )
    }
}

export default Tips;