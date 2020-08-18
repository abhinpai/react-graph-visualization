import React from 'react';
import './Footer.scss';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CropFreeIcon from '@material-ui/icons/CropFree';

function Footer() {

  const show =() =>{
    const inspectorPane = document.getElementById("inspector-pane");
    inspectorPane.style.marginRight = "0";
  }
  
  const hide =() =>{
    const inspectorPane = document.getElementById("inspector-pane");
    inspectorPane.style.marginRight = "-50%";
  }
  return (
    <div className='footer'>
      <span> 
        <AddIcon onClick={show} fontSize={'small'} />
      </span>
      <span>
        <RemoveIcon  onClick={hide} fontSize={'small'} />
      </span>
      <span>
        <CropFreeIcon fontSize={'small'} />
      </span>
    </div>
  );
}

export default Footer;
