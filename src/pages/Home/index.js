import React from 'react'
import { Route, NavLink, Switch } from 'react-router-dom'
import { TabBar } from 'antd-mobile'

import 'antd-mobile/dist/antd-mobile.css'
import './index.scss'
import Index from './Index/index'
import House from './House'
import Profile from './Profile'
import News from './News'
import NoMatch from '../NoMatch'
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 用于设置默认选中的标签栏
      selectedTab: 'blueTab'
    }
  }
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
          <TabBar
            unselectedTintColor="#949494"
            tintColor="#42c38e"
            barTintColor="white"
          >
            <TabBar.Item
              title="首页"
              key="首页"
              icon={<span className="iconfont icon-ind"></span>}
              selectedIcon={<span className="iconfont icon-ind"></span>}
              selected={this.state.selectedTab === 'blueTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'blueTab'
                })
                this.props.history.push('/home')
              }}
            ></TabBar.Item>
            <TabBar.Item
              icon={<span className="iconfont icon-findHouse"></span>}
              selectedIcon={<span className="iconfont icon-findHouse"></span>}
              title="找房"
              key="找房"
              selected={this.state.selectedTab === 'redTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'redTab'
                })
                this.props.history.push('/home/house')
              }}
            ></TabBar.Item>
            <TabBar.Item
              icon={<span className="iconfont icon-infom"></span>}
              selectedIcon={<span className="iconfont icon-infom"></span>}
              title="资讯"
              key="资讯"
              selected={this.state.selectedTab === 'greenTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'greenTab'
                })
                this.props.history.push('/home/news')
              }}
            ></TabBar.Item>
            <TabBar.Item
              icon={<span className="iconfont icon-my"></span>}
              selectedIcon={<span className="iconfont icon-my"></span>}
              title="我的"
              key="我的"
              selected={this.state.selectedTab === 'yellowTab'}
              onPress={() => {
                this.setState({
                  selectedTab: 'yellowTab'
                })
                this.props.history.push('/home/profile')
              }}
            ></TabBar.Item>
          </TabBar>
        </div>
      </div>
    )
  }
}

export default Home
