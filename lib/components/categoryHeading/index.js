import React from 'react';

var CategoryHeading = React.createClass(
  {
    render: function() {
      return <h4 className='txt--uppercase txt--neutral'>{this.props.content}</h4>
    }
  }
);

export default CategoryHeading;
