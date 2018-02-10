import React, { Component } from 'react';
import './ImageView.css';

class ImageView extends Component {
  close(e){
    if(e.target.className === "app-image-container")
      this.props.closeModal();
  }
  closeByIcon(){
    this.props.closeModal();
  }
  render(){
    return (
      <div className="app-image-container" onClick={(e) => this.close(e)}>
        <div className="app-image" style={{background:`url('${this.props.imageUrl}')`, backgroundSize:'60%, auto', backgroundRepeat:'no-repeat', backgroundColor:'rgba(0,0,0,.8)', backgroundPosition:'center'}}>
          <i className="fas fa-times close-modal" onClick={() => this.closeByIcon()}></i>
        </div>
      </div>
    );
  }
}

export default ImageView;
