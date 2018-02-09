import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
import AlertDialog from './../components/AlertDialog';
import Sidebar from './../components/Sidebar';
import SecondarySidebar from './../components/SecondarySidebar';
import './LoggedIn.css';

class LoggedIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      username:"",
      notLoggedIn:null,
      page:"Profile",
      pages:["Profile"],
      view:"Kullanıcı Bilgileri",
      pageIcons:[],
      items:[]
    }
  }

  componentWillMount(){
    var pages = [];
    var pageIcons = [];

    var temp_profile = [];
    var temp_home = [];
    var temp_users = [];
    var temp_keys = [];

    pageIcons.push({icon:"fas fa-home", page:"Home"}, {icon:"fas fa-users", page:"Users"}, {icon:"fas fa-key", page:"Keys"}, {icon:"fas fa-user", page:"Profile"});

    temp_profile.push({title:"Kullanıcı Bilgileri", icon:"fas fa-user"}, {title:"Oluşturulan Anahtarlar", icon:"fas fa-key"}, {title:"Hesap Ayarları", icon:"fas fa-cog"}, {title:"Çıkış Yap", icon:"fas fa-power-off"});

    temp_keys.push({title:"Anahtarlar", icon:"fas fa-key"}, {title:"Anahtar oluştur", icon:"fab fa-keycdn"});

    pages["Profile"] = temp_profile;
    pages["Keys"] = temp_keys;

    this.setState({
      pageIcons:pageIcons,
      pages:pages,
      items:pages[this.state.page]
    });

    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        firebase.database().ref(`users/${user.uid}`).once('value', snap => {
          const userInfo = snap.val();
          this.setState({
            username:userInfo.username,
            profile_picture:userInfo.profile_picture
          });
        });
      } else {
        this.setState({
          notLoggedIn:true
        });
      }
    });
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
  setItem(index){
    this.setState({
      view:this.state.items[index].title
    });
  }
  setPage(page){
    this.setState({
      page:page,
      items:this.state.pages[page]
    });
    console.log(this.state.pages[page]);
  }
  render(){
    return (
      <div className="app-home-container">
        {this.redirectToHome()}
        {this.checkDialog()}
        <Sidebar items={this.state.pageIcons} setPage={(page) => this.setPage(page)}/>
        <SecondarySidebar onclick={() => this.closeModal()} items={this.state.items} setItem={(item) => this.setItem(item)}/>
      </div>
    );
  }
}

export default LoggedIn;
