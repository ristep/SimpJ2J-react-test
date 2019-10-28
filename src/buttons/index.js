import React from 'react';
import classNames from 'classnames';
import "../App.css";
import  Button  from 'react-bootstrap/Button';

function Btn(props) {
  const { classes, children, ...other } = props;

  return ( 
    <span>
      <Button className={classNames( classes,'butn') } {...other}>
        {children}
      </Button>
    </span>
  );
}

export default Btn;
