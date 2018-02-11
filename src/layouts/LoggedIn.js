import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
import AlertDialog from './../components/AlertDialog';
import Sidebar from './../components/Sidebar';
import SecondarySidebar from './../components/SecondarySidebar';
import UploadProgress from './../components/UploadProgress';
import Inbox from './../components/Inbox';
import ChattedWithNoOne from './fragments/ChattedWithNoOne';
import UserInfo from './fragments/UserInfo';
import Message from './fragments/Message';
import AllUsers from './fragments/AllUsers';
import './LoggedIn.css';

class LoggedIn extends Component {
  constructor(props){
    super(props);
    this.state = {
      username:"",
      notLoggedIn:null,
      page:"Users",
      pages:[],
      renderSeperate:false,
      pageIcons:[],
      items:[],
      messages:[],
      view:"Anasayfa",
      userInfo:null,
      allUsers:null,
      inbox:null,
      bio:"",
      messageVal:"",
      messagePage:1,
      messagePerPage:20
    }
  }

  componentWillMount(){
    var pages = [];
    var pageIcons = [];

    var temp_profile = [];
    var temp_users = [];
    var temp_inbox = [];

    pageIcons.push({icon:"fas fa-users", page:"Users"}, {icon:"fas fa-inbox  ", page:"Inbox"}, {icon:"fas fa-user", page:"Profile"});


    temp_users.push({title:"Mesajlar", icon:"fas fa-inbox"}, {title:"Kullanıcılar", icon:"fas fa-users"});

    temp_inbox.push({title:"Anahtarlar", icon:"fas fa-key"}, {title:"Anahtar oluştur", icon:"fab fa-keycdn"});

    temp_profile.push({title:"Profil", icon:"fas fa-user"}, {title:"Çıkış Yap", icon:"fas fa-power-off"});

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
        userRef.child("status").set(true);
        userRef.child("status").onDisconnect().set(null);
        userRef.once('value', snap => {
          const userInfo = {...snap.val(), uid:snap.key};

          this.setState({
            userInfo:userInfo
          });
        }).then(() => {
          const inboxRef = firebase.database().ref(`chat/${firebase.auth().currentUser.uid}`);
          const inbox = [];
          inboxRef.on("child_added", snap => {
            const inboxItem = snap.val();
            const from = snap.key;

            const usersRef = firebase.database().ref("users");
            usersRef.child(from).once("value", snapshot => {
              const user = snapshot.val();

              inbox.push({...inboxItem, user:{...user, key:from}});
              inbox.sort((a,b) => {
                if(a.timestamp > b.timestamp)
                  return -1;
                else
                  return 1;
              });

              this.setState({
                inbox:inbox
              });
            });
          });

          inboxRef.on("child_changed", p2 => {
            const from = p2.key;

            var inboxItems = this.state.inbox;
            var values = p2.val();

            var index = inboxItems.findIndex(item => item.user.key === from);

            inboxItems[index] = {...inboxItems[index], last_message:values.last_message, type:values.type, timestamp:values.timestamp};

            inboxItems.sort((a,b) => {
              if(a.timestamp > b.timestamp)
                return -1;
              else
                return 1;
            });

            this.setState({
              inbox:inboxItems
            });
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
  goBackFromAll(){
    this.setState({
      view:"Users"
    });
  }
  setChatItem(key, user, bool = false, bool2 = false){
    const othId = user.key;
    const myId = firebase.auth().currentUser.uid;
    const messages = [];
    const messagesRef = firebase.database().ref(`messages/${myId}/${othId}`);

    messages[user.key] = [];
    var messagePage = this.state.messagePage + 1;

    this.setState({
      selectedKey:key
    });

    if(bool2 === false){
      this.setState({
        messagePage:1
      });
      messagePage = 1;
    } else {
      this.setState({
        messagePage:messagePage
      });
    }

    if(bool === true){
      this.setState({
        view:"MessageFull",
        otherUser:user,
        selectedChat:user,
      });
    } else {
      this.setState({
        view:"Message",
        otherUser:user,
        selectedChat:user,
      });
    }

    this.setState({
      currentMessages:messages[user.key]
    });

    messagesRef.limitToLast(messagePage * this.state.messagePerPage).on("child_added", snap => {
      messages[user.key].push({...snap.val(), key:snap.key});
      this.setState({
        messages:messages
      });
    });
  }
  getUsers(){
    this.setState({
      view:"Users"
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
    if(page === "Users"){
      this.setState({
        page:"Users"
      });
    }
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

    if(this.state.bio.length <= 140 && this.state.bio.length > 0){
      bioRef.set(this.state.bio).then(() => {
        this.setState({
          userInfo:{...this.state.userInfo, bio:this.state.bio}
        });
      });
    } else {
      alert("0 ile 140 arasında bir bio seçin");
    }
  }
  sendMessage(e, key){
    if(this.state.messageVal !== ""){
      const message = this.state.messageVal;

      this.setState({
        messageVal:""
      });

      const uid = key;
      const myUid = this.state.userInfo.uid;
      const selfMessageRef = firebase.database().ref(`messages/${myUid}/${uid}`);
      const otherUserMessageRef = firebase.database().ref(`messages/${uid}/${myUid}`);

      const selfChatRef = firebase.database().ref(`chat/${myUid}/${uid}`);
      const otherUserChatRef = firebase.database().ref(`chat/${uid}/${myUid}`);

      const messageKey = selfMessageRef.push().key;

      const lastMessageObj = {
        timestamp:new Date().getTime(),
        type:"text",
        last_message:message
      }

      const messageObj = {
        type:"text",
        message:message,
        from:myUid
      }

      selfMessageRef.child(messageKey).set(messageObj);
      otherUserMessageRef.child(messageKey).set(messageObj);
      selfChatRef.update(lastMessageObj);
      otherUserChatRef.update(lastMessageObj);
    }
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
  getAllUsers(bool = true){
    if(this.state.allUsers === null || bool === false){
      const usersRef = firebase.database().ref("users");

      usersRef.once("value", snap => {
        const allUsers = snap.val();
        this.setState({
          allUsers:allUsers
        });
      });
    }
  }
  loadMore(user){
    var index = this.state.inbox.findIndex(item => item.user.key === user.key);

    this.setChatItem(index, this.state.inbox[index].user, false, true);
  }
  renderView(){
    if(this.state.page !== "Users"){
      if(this.state.page === "Inbox" && this.state.inbox === null)
        return <ChattedWithNoOne />;
      else {
        if(this.state.view === "Profil")
          return <UserInfo userInfo={this.state.userInfo} onBioChange={(e) => this.onBioChange(e)} bioVal={this.state.bio} updatePp={(e) => this.updatePp(e)} changeBio={() => this.changeBio()} />;
        else if(this.state.view === "Message")
          if(this.state.inbox[this.state.selectedKey] !== undefined)
            return <Message withUser={this.state.selectedChat} lastMessage={this.state.inbox[this.state.selectedKey].last_message} sendMessage={(e, key) => this.sendMessage(e, key)} setMessage={(e, bool) => this.setMessage(e, bool)} messageVal={this.state.messageVal} messages={this.state.currentMessages} userInfo={this.state.userInfo} sendImage={(e, user) => this.sendImage(e, user)} loadMore={(user) => this.loadMore(user)} />
          else
            return <Message withUser={this.state.selectedChat} sendMessage={(e, key) => this.sendMessage(e, key)} setMessage={(e, bool) => this.setMessage(e, bool)} messageVal={this.state.messageVal} messages={this.state.currentMessages} userInfo={this.state.userInfo} sendImage={(e, user) => this.sendImage(e, user)} loadMore={(user) => this.loadMore(user)} />
        else
          return null;
      }
    }
    else if(this.state.page === "Users")
      if(this.state.view === "MessageFull")
        if(this.state.inbox !== null && this.state.inbox[this.state.selectedKey] !== undefined)
          return <Message withUser={this.state.selectedChat} lastMessage={this.state.inbox[this.state.selectedKey].last_message} sendMessage={(e, key) => this.sendMessage(e, key)} setMessage={(e, bool) => this.setMessage(e, bool)} messageVal={this.state.messageVal} messages={this.state.currentMessages} userInfo={this.state.userInfo} sendImage={(e, user) => this.sendImage(e, user)} backButton={true} goBack={() => this.goBackFromAll()} loadMore={(user) => this.loadMore(user)} />
        else
          return <Message withUser={this.state.selectedChat} sendMessage={(e, key) => this.sendMessage(e, key)} setMessage={(e, bool) => this.setMessage(e, bool)} messageVal={this.state.messageVal} messages={this.state.currentMessages} userInfo={this.state.userInfo} sendImage={(e, user) => this.sendImage(e, user)} backButton={true} goBack={() => this.goBackFromAll()} loadMore={(user) => this.loadMore(user)} />
      else
        return <AllUsers user={this.state.userInfo} users={this.state.allUsers} getUsers={() => this.getAllUsers()} setItem={(key, user, bool) => this.setChatItem(key, user, bool)} />
  }
  sendImage(e, key){
    const myUid = this.state.userInfo.uid;
    const otherUid = key;
    const selfMessageRef = firebase.database().ref(`messages/${myUid}/${otherUid}`);
    const otherUserMessageRef = firebase.database().ref(`messages/${otherUid}/${myUid}`);
    const selfChatRef = firebase.database().ref(`chat/${myUid}/${otherUid}`);
    const otherUserChatRef = firebase.database().ref(`chat/${otherUid}/${myUid}`);

    const messageId = selfMessageRef.push().key;


    const file = e.target.files[0];

    const storageRef = firebase.storage().ref(`images/${messageId}.png`);
    const task = storageRef.put(file);


    task.on("state_changed",(snapshot) => {
      var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      this.setState({
        progress:`Gönderiliyor.. (%${progress})`,
        uploading:true
      });
      switch (snapshot.state) {
        case firebase.storage.TaskState.PAUSED:
          console.log('Yükleme durduruldu.');
          break;
        default:
          break;
      }
    }, (error) => {
      console.log(error);
    }, () => {
        const downloadURL = task.snapshot.downloadURL;
        const messageObj = {
          image_url:downloadURL,
          from:myUid,
          type:"image"
        };
        this.setState({
          progress:"Yükleme başarılı"
        });
        const lastMessageObj = {
          timestamp:new Date().getTime(),
          type:"image",
          last_message:"Görüntü"
        }

        selfMessageRef.child(messageId).set(messageObj);
        otherUserMessageRef.child(messageId).set(messageObj);
        selfChatRef.update(lastMessageObj);
        otherUserChatRef.update(lastMessageObj);
      }
    );
  }
  getSecondarySidebar(){
    if(this.state.page === "Inbox"){
      if(this.state.inbox !== null){
        return <Inbox inbox={this.state.inbox} chatUser={this.state.selectedChat} setItem={(key, user) => this.setChatItem(key, user)} />;
      } else {
        return null;
      }
    }
    else if(this.state.page === "Users"){
      return null;
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
        <Sidebar items={this.state.pageIcons} setPage={(page) => this.setPage(page)} />
        {this.getSecondarySidebar()}
        {this.renderView()}
      </div>
    );
  }
}

export default LoggedIn;
