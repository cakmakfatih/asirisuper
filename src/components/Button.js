import React, { Component } from 'react';
import './Button.css';

class Button extends Component {
  render(){
    if(this.props.onclick){
      return(
        <button style={{width:this.props.width}} onClick={(e) => this.props.onclick(e)}>
          {this.props.value}
        </button>
      );
    } else {
      return(
        <button style={{width:this.props.width}}>
          {this.props.value}
        </button>
      );
    }
  }
}

export default Button;
