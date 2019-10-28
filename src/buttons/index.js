import React from 'react';
import "../App.css";
import  Button  from 'react-bootstrap/Button';

function Btn(props) {
  const { classes, children, ...other } = props;

  return ( 
    <span>
      <Button size="lg" className="butn" {...other}>
        {children}
      </Button>
    </span>
  );
}

export default Btn;
