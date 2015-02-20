import React from 'react';

var CategoryHeading = React.createClass(
  {
    render: function() {
      return <h3 className='txt--uppercase txt--neutral'>{this.props.content}</h3>
    }
  }
);

export default CategoryHeading;
