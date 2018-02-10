import React, { Component } from 'react';
import './UploadProgress.css';

class UploadProgress extends Component {
  render(){
    if(this.props.progress === "Yükleme başarılı"){
      return (
        <div className="upload-progress">
          <span>{this.props.progress}</span>
          <i onClick={() => this.props.dismissUpload()} className="fas fa-check-circle upload-complete"></i>
        </div>
      )
    }
    return (
      <div className="upload-progress">
        <span>{this.props.progress}</span>
        <i className="fas fa-spinner uploading"></i>
      </div>
    );
  }
}

export default UploadProgress;
