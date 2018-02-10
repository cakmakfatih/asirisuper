import React, { Component } from 'react';
import ImageView from './../../components/ImageView';
import './Message.css';

class Message extends Component {
  constructor(props){
    super(props);
    this.state = { colorSendable:"#fff", colorEmpty:"#333", viewImage:false }
  }
  scrollToBottom(ref){
    this.refs[ref].scrollIntoView();
  }
  componentDidMount(){
    this.scrollToBottom("message-id");
  }
  handleKeyPress(e){
    if(e.key === 'Enter')
      this.props.sendMessage(e);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.withUser !== this.props.withUser)
      this.props.setMessage(null, true);
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
  render() {
    const { withUser } = this.props;
    return (
      <div className="app-message-container">
        {this.viewImage()}
        <div className="chat-header">
          <div className="header-leftside-container">
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
        <div className="app-messages" id="scroll-messages">
          <div className="message-from">
            <p>Selam naber?</p>
          </div>
          <div className="message-to">
            <p>İyidir senden?</p>
          </div>
          <div className="message-to-img-container">
            <div className="message-to-img"
            onClick={() => this.setImage(withUser.profile_picture)} style={{backgroundImage:`url('${withUser.profile_picture}')`}}></div>
          </div>
          <div className="message-from-img-container" ref="message-id">
            <div className="message-from-img" onClick={() => this.setImage(withUser.profile_picture)} style={{backgroundImage:`url('${withUser.profile_picture}')`}}></div>
          </div>
        </div>
        <div className="app-send-message-container">
          <input type="text" onChange={(e) => this.props.setMessage(e)} value={this.props.messageVal} onKeyPress={(e) => this.handleKeyPress(e)} className="message-input" placeholder="Bir mesaj yazın.." />
          <i className="fas fa-camera btn-send-message" style={{color:"#333"}}></i>
          <i className="fas fa-chevron-circle-right btn-send-message" style={{color:this.props.messageVal.length > 0 ? this.state.colorSendable : this.state.colorEmpty}} onClick={(e) => this.props.sendMessage(e)}></i>
        </div>
      </div>
    );
  }
}

export default Message;
