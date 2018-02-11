import React, { Component } from 'react';
import './Inbox.css';

class Inbox extends Component {
  constructor(){
    super();
    this.state = { selectedChat: 0 };
  }
  componentWillMount(){
    var item = this.props.inbox.reduce((a,b) => { return a.timestamp > b.timestamp ? a : b });
    this.selectItem(0, item.user);
  }
  selectItem(key, user){
    var index = this.props.inbox.findIndex(item => item.user.key === user.key);

    this.setState({
      selectedChat:user.key
    });

    if(this.props.inbox[index] !== undefined)
      this.props.setItem(index, this.props.inbox[index].user);
  }
  getLastMessage(inbox){
    const user = inbox.user;
    if(inbox.type === "text"){
      return (
        <div className="message-info">
          <h3 className="username-inbox">{user.username}</h3>
          <p className="last-message">{inbox.last_message.length > 35 ? `${inbox.last_message.slice(0, 35)}...` : inbox.last_message}</p>
        </div>
      )
    }
    else if(inbox.type === "image"){
      const user = inbox.user;
      return (
        <div className="message-info">
          <h3 className="username-inbox">{user.username}</h3>
          <p className="last-message"><i className="fas fa-camera"></i> Görüntü</p>
        </div>
      );
    }
    else {
      return null;
    }
  }
  renderUsers(){
    return this.props.inbox.map((inbox, key) => {
      const user = inbox.user;
      const defaultPp = "https://mbevivino.files.wordpress.com/2011/08/silhouette_default.jpg";
      const defaultBio = "";
      if(user.profile_picture === undefined)
        user.profile_picture = defaultPp;
      if(user.bio === undefined)
        user.bio = defaultBio;
      return (
        <div className={inbox.user.key === this.state.selectedChat ? "inbox-item active-inbox-item" : "inbox-item"} key={user.key} onClick={() => this.selectItem(key, user)}>
          <div className="inbox-pp" style={{backgroundImage:`url('${user.profile_picture}')`}}></div>
          {this.getLastMessage(inbox)}
        </div>
      );
    });
  }
  render(){
    return (
      <div className="app-inbox-container" id="scroll-messages">
        {this.renderUsers()}
      </div>
    );
  }
}

export default Inbox;
