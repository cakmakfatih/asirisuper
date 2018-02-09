import React, { Component } from 'react';
import './SecondarySidebar.css';

class SecondarySidebar extends Component {
  constructor(props){
    super(props);
    this.state = {
      active:0
    }
  }
  setActive(key){
    this.setState({
      active:key
    });
    this.props.setItem(key);
  }
  renderItems(){
    return this.props.items.map((item, key) => {
      if(key !== (this.props.items.length - 1)){
        return (
          <div className={key === this.state.active ? "secondary-menu-item secondary-active" : "secondary-menu-item"} onClick={() => this.setActive(key)} key={key}>
            <i className={item.icon}></i>
            <span>{item.title}</span>
          </div>
        );
      } else {
        return null;
      }
    });
  }
  renderLastItem(){
    return (
      <div className={(this.props.items.length - 1) === this.state.active ? "secondary-menu-item secondary-active" : "secondary-menu-item"} onClick={(e) => this.props.onclick(e)}>
        <i className={this.props.items[this.props.items.length - 1].icon}></i>
        <span>{this.props.items[this.props.items.length - 1].title}</span>
      </div>
    );
  }
  render(){
    return (
      <div className="app-secondary-sidebar">
        <div className="secondary-upper-menu">
          {this.renderItems()}
        </div>
        {this.renderLastItem()}
      </div>
    );
  }
}

export default SecondarySidebar;
