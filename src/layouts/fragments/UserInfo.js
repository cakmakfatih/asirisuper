import React, { Component } from 'react';
import ImageView from './../../components/ImageView';
import Button from './../../components/Button';
import InputDialog from './../../components/InputDialog';
import './UserInfo.css';

class UserInfo extends Component {
  constructor(props){
    super(props);
    this.state = { loaded: false, viewImage:false, inputModal:false }
  }
  componentWillMount(){
    if(this.props.userInfo){
      const userInfo = this.props.userInfo;

      const defaultPp = "https://mbevivino.files.wordpress.com/2011/08/silhouette_default.jpg";
      const defaultBio = "Hakkında bir şeyler yaz";

      if(userInfo.profile_picture === undefined)
        userInfo.profile_picture = defaultPp;
      if(userInfo.bio === undefined)
        userInfo.bio = defaultBio;

      this.setState({
        userInfo:userInfo,
        loaded:true
      });
    }
  }
  componentWillReceiveProps(nextProps, prevProps){
    if(nextProps.userInfo !== null){
      const userInfo = nextProps.userInfo;

      const defaultPp = "https://mbevivino.files.wordpress.com/2011/08/silhouette_default.jpg";
      const defaultBio = "Hakkında bir şeyler yaz";

      if(userInfo.profile_picture === undefined)
        userInfo.profile_picture = defaultPp;
      if(userInfo.bio === undefined)
        userInfo.bio = defaultBio;

      this.setState({
        userInfo:userInfo,
        loaded:true
      });
    }
  }
  setImage(url){
    this.setState({
      imageToView:url
    });
    this.toggleImageModal();
  }
  toggleImageModal(){
    this.setState({
      viewImage:!this.state.viewImage
    });
  }
  viewImage(){
    if(this.state.viewImage === true)
      return <ImageView imageUrl={this.state.imageToView} closeModal={() => this.toggleImageModal()}/>
    else
      return null;
  }
  cancelBioChange(){
    alert('btn cancel');
  }
  toggleInputModal(){
    this.setState({
      inputModal:!this.state.inputModal
    });
  }
  renderInputModal(){
    if(this.state.inputModal)
      return <InputDialog onBioChange={(e) => this.props.onBioChange(e)} val={this.props.bioVal} btnPositive={() => this.props.changeBio()} btnNegative={() => this.toggleInputModal()} toggleInputModal={() => this.toggleInputModal()} title="Bio'yu Güncelle" placeholder="Kısa ve net cümlelerle kendini tanıt." positiveBtnBody="GÜNCELLE"/>;
    else
      return null;
  }
  render() {
    if(this.state.loaded){
      const { userInfo } = this.state;
      return (
        <div className="fragment-container">
          {this.viewImage()}
          {this.renderInputModal()}
          <div className="profile-picture-container" style={{backgroundImage:`url('${userInfo.profile_picture}')`}}></div>
          <div className="image-transparency-effect" onClick={() => this.setImage(userInfo.profile_picture)}>
            <input type="file" id="upload-image" onChange={(e) => this.props.updatePp(e)} name="upload-image" style={{display:'none'}} />
            <label htmlFor="upload-image" style={{cursor:'pointer'}}><i className="fas fa-camera"></i></label>
            <i className="fas fa-expand" onClick={() => this.setImage(userInfo.profile_picture)}></i>
          </div>
          <h1 className="username">{userInfo.username}</h1>
          <div className="about">
            <p className="bio">{userInfo.bio}</p>
            <Button value="BIO'YU GÜNCELLE" onclick={() => this.toggleInputModal()} width="wrap-content"/>
          </div>
          <div className="user-info">
            <div className="single-info">

            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div className="fragment-container" style={{justifyContent:'center'}}>
          <div className="loader"></div>
        </div>
      );
    }
  }
}

export default UserInfo;
