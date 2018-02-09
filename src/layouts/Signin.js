import React, { Component } from 'react';
import Button from './../components/Button';
import Input from './../components/Input';
import { Link, Redirect } from 'react-router-dom';
import * as firebase from 'firebase';
import './Signin.css';

class Signin extends Component {
  constructor(props){
    super(props);
    this.state = {
      username:"",
      password:""
    };
  }
  setField(e, field){
    switch(field){
      case "username":
        this.setState({
          username:e.target.value
        });
        break;
      case "password":
        this.setState({
          password:e.target.value
        });
        break;
      default:
        break;
    }
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

  redirect(){
    if(this.state.redirect === true)
      return <Redirect to='/home' />;
  }

  signIn(e){
    e.preventDefault();
    if(this.state.username !== "" && this.state.password !== ""){
      if(this.state.username.indexOf("@") > -1)
        this.signInWithEmail();
      else
        this.signInWithUsername();
    }
    else
      alert('tüm alanları dldr .s');
  }

  signInWithEmail(){
    firebase.auth().signInWithEmailAndPassword(this.state.username, this.state.password).catch((error) => {
      alert(error.message);
    });
  }

  signInWithUsername(){
    const usernamesRef = firebase.database().ref("usernames");

    usernamesRef.once('value', snap => {
      if(snap.hasChild(this.state.username)){
        const email = snap.child(this.state.username).val();
        firebase.auth().signInWithEmailAndPassword(email, this.state.password).catch((error) => {
          alert(error.message);
        });
      }
      else
        alert('kullanıcı adı mevct değl .s');
    });
  }

  render(){
    return (
      <div className="app-signin">
        {this.redirect()}
        <Link to='/'><h1>aşırısüper</h1></Link>
        <form className="form-container">
          <Input type="text" placeholder="E-posta veya kullanıcı adı" onchange={(e) => this.setField(e, "username")} val={this.state.username}/>
          <Input type="password" placeholder="Şifre"  onchange={(e) => this.setField(e, "password")} val={this.state.password}/>
          <Button value="GİRİŞ YAP" width="80%" onclick={(e) => this.signIn(e)}/>
        </form>
      </div>
    );
  }
}

export default Signin;
