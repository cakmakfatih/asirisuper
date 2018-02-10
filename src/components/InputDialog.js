import React, { Component } from 'react';
import Input from './Input';
import Button from './Button';
import './InputDialog.css';

class InputDialog extends Component {
  close(e){
    if(e.target.className === "app-input-dialog-container")
      this.props.toggleInputModal();
  }
  setBio(){
    this.props.toggleInputModal();
    this.props.btnPositive();
  }
  render(){
    return (
      <div className="app-input-dialog-container" onClick={(e) => this.close(e)}>
        <div className="app-input-dialog">
          <h2 className="input-title">{this.props.title}</h2>
          <Input type="text" className="input-body-container" placeholder={this.props.placeholder} width="90%" onchange={(e) => this.props.onBioChange(e)}/>
          <div className="btn-container">
            <Button value="İPTAL" onclick={() => this.props.btnNegative()} width="250px"/>
            <Button value={this.props.positiveBtnBody} onclick={() => this.setBio()} width="250px" />
          </div>
        </div>
      </div>
    );
  }
}

export default InputDialog;
