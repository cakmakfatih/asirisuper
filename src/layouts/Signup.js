import React, { Component } from 'react';
import Button from './../components/Button';
import Input from './../components/Input';
import AlertDialog from './../components/AlertDialog';
import { Link, Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
import './Signup.css';

class Signup extends Component {
  constructor(props){
    super(props);
    this.state = {
      key:"",
      username:"",
      email:"",
      password:"",
      passwordAgain:"",
      isAwesome:false
    };
  }
  componentWillMount(){
    firebase.auth().onAuthStateChanged((user) => {
      if(user){
        this.setState({
          redirect:true
        });
      } else {

      }
    });
  }
  setField(e, field){
    switch(field) {
      case "key":
        this.setState({
          key:e.target.value
        });
        break;
      case "username":
        this.setState({
          username:e.target.value
        });
        break;
      case "email":
        this.setState({
          email:e.target.value
        });
        break;
      case "password":
        this.setState({
          password:e.target.value
        });
        break;
      case "passwordAgain":
        this.setState({
          passwordAgain:e.target.value
        });
        break;
      case "isSuperior":
        this.setState({
          isAwesome:e.target.checked
        });
        break;
      default:
        break;
    }
  }
  signUp(e){
    e.preventDefault();
    const rootRef = firebase.database().ref();
    const keyRef = rootRef.child("keys");
    const usernamesRef = rootRef.child("usernames");
    const usersRef = rootRef.child("users");

    if(this.state.key !== "" && this.state.username !== "" && this.state.email !== "" && this.state.password !== "" && this.state.passwordAgain !== ""){
      keyRef.once('value', snap => {
        if(snap.hasChild(this.state.key)){
          usernamesRef.once('value', snapshot => {
            if(snapshot.hasChild(this.state.username))
              this.setError("Hata", "Kullanıcı adı zaten mevcut.");
            else {
              if(this.state.password === this.state.passwordAgain){
                if(this.state.isAwesome){
                    firebase.auth().createUserWithEmailAndPassword(this.state.email, this.state.password).catch((error) => {
                      this.setError("Firebase Hatası", error.message);
                      return true;
                  }).then((e) => {
                    if(e !== true){
                      keyRef.child(this.state.key).remove();
                      usernamesRef.child(this.state.username).set(firebase.auth().currentUser.email);
                      usersRef.child(firebase.auth().currentUser.uid).set({
                        username:this.state.username,
                        email:this.state.email,
                      });
                    }
                  });
                } else {
                  this.setError("Hata", "Aşırı süper olduğunu onaylamalısın.");
                }
              } else
                this.setError("Hata", "Şifreler aynı değil.");
            }
          });
        } else
          this.setError("Hata", "Girilen anahtar mevcut değil.");
      });
    } else {
      this.setError("Hata", "Lütfen tüm alanları doldurunuz.");
    }
  }
  setError(title, message){
    this.setState({
      errorTitle:title,
      errorMessage:message
    });
    this.closeModal();
  }
  closeModal(){
    this.setState({
      showDialog:!this.state.showDialog
    });
  }
  checkDialog(){
    if(this.state.showDialog === true){
      return <AlertDialog title={this.state.errorTitle} message={this.state.errorMessage} buttonCount={1} closeModal={() => this.closeModal()} />;
    } else {
      return null;
    }
  }
  redirect(){
    if(this.state.redirect)
      return <Redirect to='/home' />;
  }
  render(){
    return (
      <div className="app-signup">
        {this.checkDialog()}
        {this.redirect()}
        <Link to='/'><h1>aşırısüper</h1></Link>
        <form className="form-container">
          <Input type="text" placeholder="Kayıt anahtarı" onchange={(e) => this.setField(e, "key")} val={this.state.key}/>
          <Input type="text" placeholder="Kullanıcı adı" onchange={(e) => this.setField(e, "username")} val={this.state.username}/>
          <Input type="email" placeholder="E-posta" onchange={(e) => this.setField(e, "email")} val={this.state.email}/>
          <Input type="password" placeholder="Şifre" onchange={(e) => this.setField(e, "password")} val={this.state.password}/>
          <Input type="password" placeholder="Şifre tekrarı" onchange={(e) => this.setField(e, "passwordAgain")} val={this.state.passwordAgain}/>
          <div className="agreement">
            <Input type="checkbox" width="10%" outline="none" onchange={(e) => this.setField(e, "isSuperior")} val={this.state.isAwesome}/><span>Aşırı süperim</span>
          </div>
          <Button value="KAYIT OL" width="80%" onclick={(e) => this.signUp(e)}/>
        </form>
      </div>
    );
  }
}

export default Signup;
