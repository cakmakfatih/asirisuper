import React, { Component } from 'react';
import Button from './../../components/Button';
import './AllUsers.css';

class AllUsers extends Component {
  constructor(props){
    super(props);
    this.state = { allUsers:null, searchVal:"" }
  }
  selectItem(key, user){
    if(user.key !== this.props.user.uid){
      this.setState({
        selectedChat:key
      });
      this.props.setItem(key, user, true);
    }
  }
  showItem(key){
    this.refs[key].style.display = "flex";
  }
  hideItem(key){
    this.refs[key].style.display = "none";
  }
  componentWillMount(){
    if(this.props.users !== null)
      this.setAll(this.props.users);
    else
      this.props.getUsers();
  }
  setAll(users){
    const arrUsers = [];
    for(let data in users){
      const defaultPp = "https://mbevivino.files.wordpress.com/2011/08/silhouette_default.jpg";
      const defaultBio = "";
      if(users[data].profile_picture === undefined)
        users[data].profile_picture = defaultPp;
      if(users[data].bio === undefined)
        users[data].bio = defaultBio;
      arrUsers.push({...users[data], key:data});
    }
    this.shuffleUsers(arrUsers);
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.users !== this.props.users)
      this.setAll(nextProps.users);
  }
  infoPop(ref, user){
    return (
      <div className="info-single-user" ref={ref} style={{display:'none'}}>
        <span className="info-username">{user.username}</span>
        <p className="info-bio">{user.bio}</p>
      </div>
    )
  }
  renderUsers(){
    var items;
    if(this.state.searchVal === "")
      items = this.state.filteredUsers;
    else
      items = this.state.allUsers;

    const filteredItems = items.filter((item) => {
      return item.bio.toLowerCase().indexOf(this.state.searchVal.toLowerCase()) !== -1 || item.username.toLowerCase().indexOf(this.state.searchVal.toLowerCase()) !== -1;
    })

    if(filteredItems.length !== 0){
      return filteredItems.map((item, key) => {
        return (
          <div className="single-user" key={key} onMouseOver={() => this.showItem(key)} onMouseOut={() => this.hideItem(key)} onClick={() => this.selectItem(item.key, item)}>
            {this.infoPop(key, item)}
            <div className="user-pp" style={{backgroundImage:`url('${item.profile_picture}')`}}></div>
          </div>
        );
      });
    } else {
      return <h3 className="all-users-page-title">Aramanıza uygun kullanıcı bulunamadı.</h3>;
    }
  }
  handleSearch(e){
    this.setState({
      searchVal:e.target.value
    });
  }
  renderLoading(){
    return <div className="loader"></div>;
  }
  shuffleUsers(allUsers = this.state.allUsers){
    const size = 15;
    var j, x, i;
    for (i = allUsers.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = allUsers[i];
        allUsers[i] = allUsers[j];
        allUsers[j] = x;
    }
    const filtered = allUsers.slice(0, size);
    this.setState({
      allUsers:allUsers,
      filteredUsers:filtered,
      loaded:true
    });
  }
  render() {
    return (
      <div className="fragment-all-users">
        <Button value="KARIŞTIR" onclick={() => this.shuffleUsers()}/>
        <div className="all-users-search-container">
          <h2 className="all-users-page-title">Kullanıcılar arasında arama yapın</h2>
          <input type="text" className="inp-search-all-users" placeholder="Ara.." value={this.state.searchVal} onChange={(e) => this.handleSearch(e)}/>
        </div>
        <div className="app-users">
          {this.state.allUsers !== null ? this.renderUsers() : this.renderLoading()}
        </div>
      </div>
    );
  }
}

export default AllUsers;
