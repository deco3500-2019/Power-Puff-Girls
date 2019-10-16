import './Tips.css';
import * as fb from '../../server.js';
import React from 'react';

class Tips extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            tips: [],
            loading: true,
            comment: ''
        })
        const id = props.match.params.itemId;
        fb.database.ref(`inventory/${id}/tips`).on('value', (tips) => {
            this.setState({
                tips: tips.val(),
                loading: false
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
        const { tips, loading, comment } = this.state;
        return (
            <div>
                <button type="button" onClick={this.goBack}>Back</button>
                <h1>Tips</h1>
                {loading ? 'Loading...' :
                    <div>

                        <ul className="tipsList">
                            {tips.map((tip, index) => {
                                return <li className="tipsItem" key={index}>{tip.text}, rating: {tip.rating}</li>
                            })}
                        </ul>

                        <input type="text" placeholder="Write a tip here.." value={comment} onChange={this.type} />
                        <button type="button" onClick={this.submitComment}>Submit comment</button>
                    </div>
                }
            </div>
        )
    }
}

export default Tips;