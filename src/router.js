/*
* @Author: lixiwei
* @Date:   2018-03-12 15:47:33
* @Last Modified by:   lixiwei
* @Last Modified time: 2018-03-12 15:50:21
*/
import React from 'react';
import { Router, Route, hashHistory} from 'react-router';
import app from '../App.js';


class Routes extends React.Component{
  render() {
    return  (
     <Router history={hashHistory}>
        <Route path="/" component={app} />
        
    </Router>
      );
  }
}


export default Routes;