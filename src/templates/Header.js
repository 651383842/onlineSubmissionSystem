import React, { Component } from 'react';
import Icon from 'antd/lib/icon';
import '../css/Header.css';

import 'antd/dist/antd.css'; 
class Header extends Component{
    constructor(props){
    	super(props);
        this.state={'name':'xss','logo_img':'http://static.samsph.com/images/logo.png','Title':'四川省人民医院编辑部'};
    }
    render(){
		    return(
		      <header>
		        <img src={this.state.logo_img}></img>
		        <h1>{this.state.Title}</h1>
		        <nav>
		       	  <ul>
		       	  	<li style={{}}>
		       	  		<h2><home><a href="#">Home</a></home></h2>
		       	  	</li>
		       	  	<a href="#" style={{position:'relative',textAlign:'left'}}>
			       	  	<Icon type="user" style={{color:'#337ab7',fontSize:'30px'}}/>
			       	  	<li style={{}}>
			       	  		<name><h1 onClick={this.logout}>{this.state.name}</h1></name>
			       	  	</li>
		       	  	</a>
		       	  </ul>
		        </nav>
		       </header>
		    )
    }
}

export default Header;