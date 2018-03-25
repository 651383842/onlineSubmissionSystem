/*
* @Author: lixiwei
* @Date:   2018-03-12 15:47:33
* @Last Modified by:   lixiwei
* @Last Modified time: 2018-03-21 17:24:12
*/
import React from 'react';
import { Router, Route, hashHistory} from 'react-router';
import AuthorCenter from './templates/AuthorCenter';
import App from './App';

class Routes extends React.Component{
  render() {
    return  (
	    <Router history={hashHistory}>
	        <Route path="/" component={AuthorCenter} />
	        <Route path="/App" component={App} />
	    </Router>
     );
  }
}


export default Routes;