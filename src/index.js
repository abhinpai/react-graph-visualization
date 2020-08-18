import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import reducer, {intialState} from './state/reducer';
import {DataLayer} from './state/DataLayer' 

ReactDOM.render(
  <React.StrictMode>
    <DataLayer reducer={reducer} initialState={intialState}>
      <App />
    </DataLayer>
  </React.StrictMode>,
  document.getElementById("root")
);

serviceWorker.unregister();
