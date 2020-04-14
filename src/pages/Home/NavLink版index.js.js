import React from 'react'
import { Route, NavLink, Switch } from 'react-router-dom'
// import { Button } from 'antd-mobile'
// import 'antd-mobile/dist/antd-mobile.css'
import './index.scss'
import Index from './Index/index'
import House from './House'
import Profile from './Profile'
import News from './News'
import NoMatch from '../NoMatch'
class Home extends React.Component {
  render() {
    return (
      <div className="home">
        {/* 路由规则 */}
        <Switch>
          <Route path="/home" exact component={Index}></Route>
          <Route path="/home/house" component={House}></Route>
          <Route path="/home/news" component={News}></Route>
          <Route path="/home/profile" component={Profile}></Route>
          <Route component={NoMatch}></Route>
        </Switch>

        <div className="tabBar">
          <ul>
            <li>
              <NavLink exact to="/home">
                <span className="iconfont icon-ind"></span>
                <p>首页</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/house">
                <span className="iconfont icon-findHouse"></span>
                <p>找房</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/news">
                <span className="iconfont icon-infom"></span>
                <p>资讯</p>
              </NavLink>
            </li>
            <li>
              <NavLink to="/home/profile">
                <span className="iconfont icon-my"></span>
                <p>我的</p>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    )
  }
}

export default Home
