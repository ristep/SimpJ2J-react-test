import React from 'react';
import classNames from 'classnames';
import "../App.css";

function Button(props) {
  const { classes, children, ...other } = props;

  return ( 
    <span>
      <a className={classNames( classes,'butn') } {...other}>
        {children}
      </a>
    </span>
  );
}

export default Button;
