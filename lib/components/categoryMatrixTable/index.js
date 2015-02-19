import React from 'react';
import CategoryHeading from '../categoryHeading';
import CategoryItemMatrix from '../categoryItemMatrix';

var CategoryMatrixTable = React.createClass(
  {
    render: function() {
      var categoryMatrix = {},
        rows = [],
        // TODO validate category is one of the key in matrix object
        categoryField = this.props.category;

      this.props.matrixData.forEach(function(matrix) {
        var field = matrix[categoryField];
        if (categoryMatrix[field]) {
          categoryMatrix[field] += matrix['wordCount'];
        } else {
          categoryMatrix[field] = matrix['wordCount'];
        }
      });
      _.forOwn(categoryMatrix, function(value, key) {
        rows.push(<CategoryItemMatrix key={key} itemName={key} wordCount={value} />)
      });
      return (
        <div>
          <CategoryHeading content={this.props.categoryName} />
          <div className='g'>{rows}</div>
        </div>
      )
    }
  }
);

export default CategoryMatrixTable;
