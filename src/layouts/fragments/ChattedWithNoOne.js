import React, { Component } from 'react';
import './ChattedWithNoOne.css';

class ChattedWithNoOne extends Component {
  render(){
    return (
      <div className="fragment-chatted-with-no-one">
        <h2 className="found-no-one">Henüz kimseyle konuşmamışsın, bu nedenle bir gelen kutun yok :(</h2>
      </div>
    );
  }
}

export default ChattedWithNoOne;
