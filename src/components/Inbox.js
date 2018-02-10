import React, { Component } from 'react';
import './Inbox.css';

class Inbox extends Component {
  constructor(){
    super();
    this.state = { selectedChat: 0 };
  }
  componentWillMount(){
    this.selectItem(0, this.props.users[0]);
  }
  selectItem(key, user){
    this.setState({
      selectedChat:key
    });
    this.props.setItem(key, user);
  }
  renderUsers(){
    return this.props.users.map((user, key) => {
      return (
        <div className={key === this.state.selectedChat ? "inbox-item active-inbox-item" : "inbox-item"} key={user.key} onClick={() => this.selectItem(key, user)}>
          <div className="inbox-pp" style={{backgroundImage:`url('${user.profile_picture}')`}}></div>
          <div className="message-info">
            <h3 className="username-inbox">{user.username}</h3>
            <p className="last-message">{user.bio}</p>
          </div>
        </div>
      );
    });
  }
  render(){
    return (
      <div className="app-inbox-container">
        {this.renderUsers()}
      </div>
    );
  }
}

export default Inbox;
