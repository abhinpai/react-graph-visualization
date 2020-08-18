import React from 'react';
import './InspectorPane.scss';

function InspectorPane() {
  return (
    <div className='inspectorPane' id="inspector-pane">
      <p className='inspectorPane__header'>Inspector Panel</p>
      <div className='properties' id='node-view'>
        <p className='properties__title'>
          Label <br />
          <span id='node-label' className='properties__value'>
            Label Value
          </span>
        </p>
        <p className='properties__title'>
          Description <br />
          <span id='node-description' className='properties__value'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate,
            excepturi tempora reprehenderit eos at id eius, exercitationem,
            dicta odit possimus quia sed! Illum, provident. Tempora libero
            aliquam odio reprehenderit vero.
          </span>
        </p>
        <p className='properties__title'>
          Node Type <br />
          <span id='node-type' className='properties__value'>
            Node Type Value
          </span>
        </p>
      </div>

      <div className='properties' id='relationship-view'>
        <p className='properties__title'>
          Relationship Name <br />
          <span id='relationship-name' className='properties__value'>
            Relationship Value
          </span>
        </p>
        <p className='properties__title'>
          Description <br />
          <span id='relationship-description' className='properties__value'>
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate,
            excepturi tempora reprehenderit eos at id eius, exercitationem,
            dicta odit possimus quia sed! Illum, provident. Tempora libero
            aliquam odio reprehenderit vero.
          </span>
        </p>
        <p className='properties__title'>
          Source Node <br />
          <span id='relationship-source' className='properties__value'>
            Source Node Label
          </span>
        </p>
        <p className='properties__title'>
          Target Node <br />
          <span id='norelationshipde-target' className='properties__value'>
            Target Node Label
          </span>
        </p>
      </div>
    </div>
  );
}

export default InspectorPane;
