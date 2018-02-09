import React, { Component } from 'react';
import './Input.css';

class Input extends Component {
  render(){
    const { type, placeholder, width, outline, val, onchange } = this.props;
    return (
      <input type={type} placeholder={placeholder} style={{width:width, outline:outline}} value={val}
      onChange={(e, field) => onchange(e, field)} />
    );
  }
}

export default Input;
