import React, { Component } from 'react';
import './Sidebar.css';

class Sidebar extends Component {
  constructor(props){
    super(props);
    this.state = { active:this.props.items.length - 1 }
  }
  setPage(key){
    this.setState({
      active:key
    });
    this.props.setPage(this.props.items[key].page);
  }
  renderIcons(){
    return this.props.items.map((item, key) => {
      if(key !== this.props.items.length - 1){
        return (
            <div className={this.state.active === key ? "menu-item active" : "menu-item"} key={key} onClick={() => this.setPage(key)}>
              <i className={item.icon}></i>
            </div>
        );
      } else {
        return null;
      }
    });
  }
  renderLastIcon(){
    return (
      <div className={this.state.active === (this.props.items.length - 1) ? "menu-item active" : "menu-item"} onClick={() => this.setPage(this.props.items.length - 1)}>
        <i className={this.props.items[this.props.items.length - 1].icon}></i>
      </div>
    );
  }
  render(){
    return (
      <div className="sidebar-container">
        <div className="sidebar-top">
          {this.renderIcons()}
        </div>
        {this.renderLastIcon()}
      </div>
    );
  }
}

export default Sidebar;
