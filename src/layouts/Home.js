import React, { Component } from 'react';
import * as firebase from 'firebase';
import { Link, Redirect } from 'react-router-dom';
import Button from './../components/Button';
import './Home.css';

class Home extends Component {
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
    if(this.state !== null && this.state.redirect === true){
      return <Redirect to='/home' />;
    }
  }
  render(){
    return(
      <div className="App">
        {this.redirect()}
        <div className="app-welcome">
          <i className="fas fa-handshake iconLogo"></i>
          <h1>aşırısüper</h1>
          <h2>sadece aşırı süper insanların kullanabileceği program</h2>
          <div>
            <Link to='/signup'>
              <Button value="KAYIT OL" />
            </Link>
            <Link to='/login'>
              <Button value="GİRİŞ YAP" />
            </Link>
          </div>
        </div>
        <span style={{margin:0, color:'#fff', display:'flex', height:'10%', alignItems:'center', fontSize:18, justifyContent:'center', width:'100%', fontFamily:'Muli'}}>&copy; Fatih Çakmak - 2018</span>
      </div>
    );
  }
}

export default Home;
