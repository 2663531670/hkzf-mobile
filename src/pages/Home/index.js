import React from 'react'
import { Route, NavLink, Switch } from 'react-router-dom'
import { TabBar } from 'antd-mobile'
import './index.scss'
import Index from './Index/index'
import House from './House'
import Profile from './Profile'
import News from './News'
import NoMatch from '../NoMatch'
const tabBar = [
  { title: '首页', icon: 'icon-ind', path: '/home' },
  { title: '找房', icon: 'icon-findHouse', path: '/home/house' },
  { title: '资讯', icon: 'icon-infom', path: '/home/news' },
  { title: '我的', icon: 'icon-my', path: '/home/profile' }
]
class Home extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      // 用于设置默认选中的标签栏
      selectedTab: this.props.location.pathname
    }
  }
  componentDidUpdate(prevProps) {
    if (prevProps.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      })
    }
  }
  tabItem() {
    return (
      <TabBar
        unselectedTintColor="#949494"
        tintColor="#42c38e"
        barTintColor="white"
      >
        {tabBar.map(item => (
          <TabBar.Item
            title={item.title}
            key={item.title}
            icon={<span className={'iconfont ' + item.icon}></span>}
            selectedIcon={<span className={'iconfont ' + item.icon}></span>}
            selected={this.state.selectedTab === item.path}
            onPress={() => {
              this.props.history.push(item.path)
            }}
          ></TabBar.Item>
        ))}
      </TabBar>
    )
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

        <div className="tabBar">{this.tabItem()}</div>
      </div>
    )
  }
}

export default Home
