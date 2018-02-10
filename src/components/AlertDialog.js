import React, { Component } from 'react';
import Button from './Button';
import './AlertDialog.css';

class AlertDialog extends Component {
  check(e){
    if(e.target.className === "app-alert-container"){
      this.props.closeModal();
    }
  }
  renderButtons(){
    if(this.props.buttonCount === 2){
      return (
        <div>
          <Button value={this.props.positiveButton} width="35%" onclick={() => this.props.confirmButton()}/>
          <Button value={this.props.negativeButton} onclick={() => this.props.closeModal()} width="35%"/>
        </div>
      );
    } else {
      return (
        <Button value="TAMAM" onclick={() => this.props.closeModal()} width="35%"/>
      );
    }
  }
  render(){
      return (
        <div className="app-alert-container" onClick={(e) => this.check(e)}>
          <div className="app-alert">
            <h2 className="alert-title">{this.props.title}</h2>
            <p>{this.props.message}</p>
            {this.renderButtons()}
          </div>
        </div>
      );
  }
}

export default AlertDialog;
