import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
import AlertDialog from './../components/AlertDialog';
import Sidebar from './../components/Sidebar';
import SecondarySidebar from './../components/SecondarySidebar';
import UploadProgress from './../components/UploadProgress';
import Inbox from './../components/Inbox';
import UserInfo from './fragments/UserInfo';
import Message from './fragments/Message';
import './LoggedIn.css';

class LoggedIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      username:"",
      notLoggedIn:null,
      page:"Home",
      pages:[],
      renderSeperate:false,
      pageIcons:[],
      items:[],
      view:"Anasayfa",
      userInfo:null,
      allUsers:null,
      messageVal:""
    }
  }

  componentWillMount(){
    var pages = [];
    var pageIcons = [];

    var temp_profile = [];
    var temp_home = [];
    var temp_users = [];
    var temp_inbox = [];

    pageIcons.push({icon:"fas fa-home", page:"Home"}, {icon:"fas fa-users", page:"Users"}, {icon:"fas fa-inbox  ", page:"Inbox"}, {icon:"fas fa-user", page:"Profile"});

    temp_home.push({title:"Anasayfa", icon:"fas fa-home"}, {title:"Paylaşımlar", icon:"fas fa-chart-pie"});

    temp_users.push({title:"Mesajlar", icon:"fas fa-inbox"}, {title:"Kullanıcılar", icon:"fas fa-users"});

    temp_inbox.push({title:"Anahtarlar", icon:"fas fa-key"}, {title:"Anahtar oluştur", icon:"fab fa-keycdn"});

    temp_profile.push({title:"Profil", icon:"fas fa-user"}, {title:"Anahtarlar", icon:"fas fa-key"}, {title:"Hesap Ayarları", icon:"fas fa-cog"}, {title:"Çıkış Yap", icon:"fas fa-power-off"});

    pages["Home"] = temp_home;
    pages["Users"] = temp_users;
    pages["Inbox"] = temp_inbox;
    pages["Profile"] = temp_profile;

    this.setState({
      pageIcons:pageIcons,
      pages:pages,
      items:pages[this.state.page]
    });

    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        const userRef = firebase.database().ref(`users/${user.uid}`);
        userRef.once('value', snap => {
          const userInfo = snap.val();

          this.setState({
            userInfo:userInfo
          });
        }).then(() => {
          var arrOfUsers = [];
          const usersRef = firebase.database().ref("users");
          usersRef.on("child_added", snap => {
            var key = snap.key;
            if(key !== firebase.auth().currentUser.uid){
              var user = {...snap.val(), key:key};
              arrOfUsers.push(user);
              this.setState({
                allUsers:arrOfUsers
              });
            }
          });
        });
      } else {
        this.setState({
          notLoggedIn:true
        });
      }
    });
  }
  onBioChange(e){
    this.setState({
      bio:e.target.value
    });
  }
  getUploadProgress(){
    if(this.state.uploading === true){
      return <UploadProgress progress={this.state.progress} dismissUpload={() => this.dismissUpload()}/>;
    } else {
      return null;
    }
  }
  closeModal(){
    this.setState({
      showDialog:!this.state.showDialog
    });
  }
  logOut(){
    this.closeModal();
    firebase.auth().signOut();
  }
  checkDialog(){
    if(this.state.showDialog === true){
      return <AlertDialog title="Çıkış Yap" message="Uygulamadan çıkmak istediğinize emin misiniz?" positiveButton="ÇIK" buttonCount={2} negativeButton="İPTAL" closeModal={() => this.closeModal()} confirmButton={() => this.logOut()}/>;
    } else {
      return null;
    }
  }
  redirectToHome(){
    if(this.state.notLoggedIn === true){
      return <Redirect to='/' />;
    }
  }
  setChatItem(key, user){
    this.setState({
      view:"Message",
      otherUser:user
    });
  }
  setItem(index){
    if(this.state.items[index].title === "Çıkış Yap"){
      this.closeModal();
    }
    else {
      this.setState({
        view:this.state.items[index].title
      });
    }
  }
  setPage(page){
    if(page === "Profile"){
      this.setState({
        renderSeperate:true,
        page:page,
        items:this.state.pages[page]
      });
    } else {
      this.setState({
        renderSeperate:false,
        page:page,
        items:this.state.pages[page]
      });
    }
  }
  updatePp(e){
    const file = e.target.files[0];

    const storageRef = firebase.storage().ref(`users/${firebase.auth().currentUser.uid}.png`);

    const task = storageRef.put(file);

    task.on("state_changed",(snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        progress:`Yükleniyor.. (%${progress})`,
        uploading:true
      });
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Upload is paused');
          break;
        default:
          break;
      }
    }, (error) => {
      console.log(error);
    }, () => {
        const selfPpRef = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/profile_picture`)
        const downloadURL = task.snapshot.downloadURL;
        selfPpRef.set(downloadURL).then(() => {
          this.setState({
            userInfo:{...this.state.userInfo, profile_picture:downloadURL},
            progress:"Yükleme başarılı"
          });
        });
      }
    );
  }
  dismissUpload(){
    this.setState({
      uploading:false
    });
  }
  changeBio(){
    const bioRef = firebase.database().ref(`users/${firebase.auth().currentUser.uid}/bio`);

    bioRef.set(this.state.bio).then(() => {
      this.setState({
        userInfo:{...this.state.userInfo, bio:this.state.bio}
      });
    });
  }
  sendMessage(e){
    const message = this.state.messageVal;
    this.setState({
      messageVal:""
    });
  }
  setMessage(e, bool = false){
    if(bool === true){
      this.setState({
        messageVal:""
      });
    } else {
      this.setState({
        messageVal:e.target.value
      });
    }
  }
  renderView(){
    if(this.state.view === "Profil")
      return <UserInfo userInfo={this.state.userInfo} onBioChange={(e) => this.onBioChange(e)} bioVal={this.state.bio} updatePp={(e) => this.updatePp(e)} changeBio={() => this.changeBio()} />;
    if(this.state.view === "Message")
      return <Message withUser={this.state.otherUser} sendMessage={(e) => this.sendMessage(e)} setMessage={(e, bool) => this.setMessage(e, bool)} messageVal={this.state.messageVal}/>
    else
      return <div>{this.state.view}</div>;
  }
  getSecondarySidebar(){
    if(this.state.page === "Inbox"){
      if(this.state.allUsers !== null){
        return <Inbox users={this.state.allUsers} setItem={(key, user) => this.setChatItem(key, user)} />;
      } else {
        return null;
      }
    }
    else
      return <SecondarySidebar items={this.state.items} setItem={(item) => this.setItem(item)} renderSeperate={this.state.renderSeperate}/>;
  }
  render(){
    return (
      <div className="app-home-container">
        {this.redirectToHome()}
        {this.checkDialog()}
        {this.getUploadProgress()}
        <Sidebar items={this.state.pageIcons} setPage={(page) => this.setPage(page)}/>
        {this.getSecondarySidebar()}
        {this.renderView()}
      </div>
    );
  }
}

export default LoggedIn;
