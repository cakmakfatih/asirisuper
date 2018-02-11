import React, { Component } from 'react';
import ImageView from './../../components/ImageView';
import './Message.css';

class Message extends Component {
  constructor(props){
    super(props);
    this.state = { colorSendable:"#fff", colorEmpty:"#333", viewImage:false };
  }
  scrollToMessage(ref){
    this.refs[ref].scrollIntoView();
  }
  handleKeyPress(e, key){
    if(e.key === 'Enter')
      this.props.sendMessage(e, key);
  }
  setAll(messages){
    this.setState({
      messages:messages
    });
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.withUser !== this.props.withUser)
      this.props.setMessage(null, true);
    if(nextProps.messages !== this.props.messages)
      this.setAll(nextProps.messages);
  }
  toggleImageModal(){
    this.setState({
      viewImage:!this.state.viewImage
    });
  }
  setImage(url){
    this.setState({
      imageToView:url
    });
    this.toggleImageModal();
  }
  viewImage(){
    if(this.state.viewImage === true)
      return <ImageView imageUrl={this.state.imageToView} closeModal={() => this.toggleImageModal()}/>
    else
      return null;
  }
  imageTo(message, key){
    return (
      <div className="message-to-img-container" ref={key} key={key}>
        <div className="message-to-img"
        onClick={() => this.setImage(message.image_url)} style={{backgroundImage:`url('${message.image_url}')`}}></div>
      </div>
    );
  }
  imageFrom(message, key){
    return (
      <div className="message-from-img-container" ref={key} key={key}>
        <div className="message-from-img" onClick={() => this.setImage(message.image_url)} style={{backgroundImage:`url('${message.image_url}')`}}></div>
      </div>
    );
  }
  componentDidMount(){
    this.setAll(this.props.messages);
  }
  componentDidUpdate(prevProps, prevState){
    if(prevProps.lastMessage !== this.props.lastMessage || this.refs["messages"].children.length === 22)
      this.scrollToMessage("dumb-div");
  }
  messageTo(message, key){
    return (
      <div className="message-to" ref={key} key={key}>
        <p>{message.message}</p>
      </div>
    );
  }
  messageFrom(message, key){
    return (
      <div className="message-from" ref={key} key={key}>
        <p>{message.message}</p>
      </div>
    );
  }
  renderMessages(){
    const selfId = this.props.userInfo.uid;
    if(this.state.messages !== undefined){
      return this.state.messages.map((message, key) => {
        if(message.type === "image")
          if(message.from === selfId)
            return this.imageTo(message, message.key);
          else
            return this.imageFrom(message, message.key);
        else if(message.type === "text")
          if(message.from === selfId)
            return this.messageTo(message, message.key);
          else
            return this.messageFrom(message, message.key);
        else
          return null;
      });
    } else {
      return null;
    }
  }
  setView(){
    this.props.goBack();
  }
  renderBackButton(){
    return (
      <i className="fas fa-arrow-left app-back-btn" onClick={() => this.setView()}></i>
    )
  }
  loadMore(){
    const user = this.props.withUser;
    this.props.loadMore(user);
  }
  render() {
    const { withUser } = this.props;
    const defaultPp = "https://mbevivino.files.wordpress.com/2011/08/silhouette_default.jpg";
    const defaultBio = "";
    if(withUser.profile_picture === undefined)
      withUser.profile_picture = defaultPp;
    if(withUser.bio === undefined)
      withUser.bio = defaultBio;
    return (
      <div className="app-message-container">
        {this.viewImage()}
        <div className="chat-header">
          <div className="header-leftside-container">
            {this.props.backButton === true ? this.renderBackButton() : null}
            <div className="chat-profile-picture-container" style={{backgroundImage:`url('${withUser.profile_picture}')`}} onClick={() => this.setImage(withUser.profile_picture)}></div>
            <div className="header-leftside">
              <h2 className="chat-username">
                {withUser.username}
              </h2>
              <p className="chat-status">
                {withUser.status !== undefined ? "Çevrimiçi" : "Çevrimdışı"}
              </p>
            </div>
          </div>
          <div className="header-rightside">
            <i className="fas fa-ellipsis-v chat-more-options"></i>
          </div>
        </div>
        <div className="app-messages" id="scroll-messages" ref="messages">
          <div ref="dumb-start-div" className="dumb-start-div" onClick={() => this.loadMore()}><i className="fas fa-arrow-up"></i></div>
          {this.renderMessages()}
          <div ref="dumb-div" style={{height:4}}></div>
        </div>
        <div className="app-send-message-container">
          <input type="text" onChange={(e) => this.props.setMessage(e)} value={this.props.messageVal} onKeyPress={(e) => this.handleKeyPress(e, withUser.key)} className="message-input" placeholder="Bir mesaj yazın.." />
          <input type="file" id="inp-send-image" style={{display:'none'}} onChange={(e) => this.props.sendImage(e, withUser.key)} />
          <label htmlFor="inp-send-image"><i className="fas fa-camera btn-send-image"></i></label>
          <i className="fas fa-chevron-circle-right btn-send-message" style={{color:this.props.messageVal.length > 0 ? this.state.colorSendable : this.state.colorEmpty}} onClick={(e) => this.props.sendMessage(e, withUser.key)}></i>
        </div>
      </div>
    );
  }
}

export default Message;
