/*
* @Author: lixiwei
* @Date:   2018-03-12 15:47:33
* @Last Modified by:   lixiwei
* @Last Modified time: 2018-03-21 17:24:12
*/
import React from 'react';
import { Router, Route, hashHistory} from 'react-router';
import { LocaleProvider } from 'antd';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import AuthorCenter from './templates/AuthorCenter';
import EditorCenter from './templates/EditorCenter';
import App from './App';

class Routes extends React.Component{
  render() {
    return  (
        <LocaleProvider locale={zh_CN}>
            <Router history={hashHistory}>
                <Route path="/" component={EditorCenter} />
                <Route path="/authorCenter" component={AuthorCenter} />
                <Route path="/App" component={App} />
            </Router>
        </LocaleProvider>
     );
  }
}


export default Routes;