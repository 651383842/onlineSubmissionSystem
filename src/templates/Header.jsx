import React, { Component } from 'react';
import Icon from 'antd/lib/icon';
import '../css/Header.css';

import 'antd/dist/antd.css';
class Header extends Component{
    constructor(props){
        super(props);
        this.state={
            'name':'xss',
            'logo_img':'http://static.samsph.com/images/logo.png',
            'Title':'四川省人民医院编辑部'
        };
    }
    logout(){

    }
    render(){
        return(
			<header className='header'>
				<logo><img src={this.state.logo_img} style={{width:'100%'}}/></logo>
				<headtitle style={{fontSize:'1.5rem'}}>{this.state.Title}</headtitle>
				<nav>
					<ul>
						<li>
							<p style={{fontSize:'1rem',marginTop:'0.5rem'}}><home><a href="/#/">Home</a></home></p>
						</li>
						<a href="#" style={{position:'relative',textAlign:'left',marginTop:'0.1rem'}}>
							<Icon type="user" style={{color:'#337ab7',fontSize:'0.8rem'}}/>
							<li style={{}}>
								<name><p style={{fontSize:'1rem',marginTop:'0.5rem'}} onClick={this.logout}>{this.state.name}</p></name>
							</li>
						</a>
					</ul>
				</nav>
			</header>
        )
    }
}

export default Header;