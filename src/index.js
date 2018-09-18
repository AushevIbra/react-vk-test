import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter, Route } from 'react-router-dom';
import MyLayout from './components/Layout';
import Stats from './components/stats';
import './firebase';
import 'antd/dist/antd.css';



ReactDOM.render(
      <BrowserRouter>
        <MyLayout>
            <Route exact path='/' component={App} />
            <Route path='/stats/:id' component={Stats} />
        </MyLayout>
  
      </BrowserRouter>
    
  
  
    ,document.getElementById('root'));
