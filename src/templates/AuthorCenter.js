/*
* @Author: lixiwei
* @Date:   2018-03-18 17:09:17
* @Last Modified by:   lixiwei
* @Last Modified time: 2018-03-21 17:22:19
*/
import React, { Component } from 'react';
import '../css/Center.css';
import AuthorCenterContent from './AuthorCenterContent';
import Header from './Header';

class AuthorCenter extends Component{
  render() {
    return (
		<div>
			<Header />
            <AuthorCenterContent />
        </div>
    );
  }
}


export default AuthorCenter;