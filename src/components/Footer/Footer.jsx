import React from 'react';
import './Footer.scss';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import CropFreeIcon from '@material-ui/icons/CropFree';

function Footer() {
  return (
    <div className='footer'>
      <span>
        <AddIcon fontSize={'small'} />
      </span>
      <span>
        <RemoveIcon fontSize={'small'} />
      </span>
      <span>
        <CropFreeIcon fontSize={'small'} />
      </span>
    </div>
  );
}

export default Footer;
