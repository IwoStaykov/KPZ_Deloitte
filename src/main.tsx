import React from 'react';
import ReactDOM from 'react-dom/client';
//import { Authenticator } from '@aws-amplify/ui-react';
import './index.css';
import App from './App';
import '@aws-amplify/ui-react/styles.css';
import { Amplify } from "aws-amplify";
//import outputs from "../amplify_outputs.json";

// outputs tmp removed for local testing. leave in for production
Amplify.configure({});

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

//AUTH removed for local testing. leave in for production
/*
root.render(
  <React.StrictMode>
    <Authenticator>
      <App />
    </Authenticator>
  </React.StrictMode>
);
*/
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);