import React, { Component } from 'react';
import './Box.scss';

class Box extends Component {

  render() {
    const { boxClassName, boxActions } = this.props;

    return (
      <div className={`box-container ${boxClassName}`}>
        <div className='box__header'>
          <h2 className='title'>{this.props.title}</h2>
          {!!boxActions && <div className='box__actions'>
            {boxActions}
          </div>}
        </div>
        <div className='box__body'>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default (Box);
