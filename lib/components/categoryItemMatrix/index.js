import React from 'react';

var CategoryItemMatrix = React.createClass(
  {
    render: function() {
      return (
        <div className='g l--pad-v-quarter'>
          <span className='w--3-4 g__item l--pad-h-half'>{this.props.itemName}</span>
          <span className='w--1-4 g__item l--pad-h-half txt--align-right' >{this.props.wordCount} <span className='txt--neutral'>words</span></span>
        </div>
      )
    }
  }
);

export default CategoryItemMatrix;
