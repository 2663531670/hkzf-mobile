import React from 'react'
import { Carousel, Flex, Grid } from 'antd-mobile'
import axios from 'axios'
import nav1 from 'assets/images/nav-1.png'
import nav2 from 'assets/images/nav-2.png'
import nav3 from 'assets/images/nav-3.png'
import nav4 from 'assets/images/nav-4.png'
import styles from './index.module.scss'
import { getCurrentCity } from 'utils/current_city'
import { BASE_URL } from 'utils/config'
const navList = [
  { path: '/home/house', icon: nav1, title: '整租' },
  { path: '/home/house', icon: nav2, title: '合租' },
  { path: '/map', icon: nav3, title: '地图找房' },
  { path: '/rent', icon: nav4, title: '去出租' }
]

class Index extends React.Component {
  state = {
    swiperList: [],
    groupList: [],
    newsList: [],
    imgHeight: (212 / 375) * window.innerWidth,
    currentCity: {
      label: '上海',
      value: ''
    }
  }
  async componentDidMount() {
    //  发送请求，获取轮播图数据
    this.getSwipers()
    console.log(BASE_URL)

    // 获取当前城市（Ip定位）

    // (高德地图获取当前城市)
    // window.AMap.plugin('AMap.CitySearch', function() {
    //   var citySearch = new window.AMap.CitySearch()
    //   citySearch.getLocalCity(function(status, result) {
    //     if (status === 'complete' && result.info === 'OK') {
    //       // 查询成功，result即为当前所在城市信息
    //       console.log(result)
    //     }
    //   })
    // })
    const city = await getCurrentCity()
    this.setState(
      {
        currentCity: city
      },
      () => {
        // 发送请求，获取租房小组数据
        this.getGroups()
        // 发送请求，获取最新资讯数据
        this.getNews()
      }
    )
  }

  getSwipers() {
    setTimeout(async () => {
      const res = await axios.get('http://localhost:8080/home/swiper')
      const { status, body } = res.data
      if (status === 200) {
        this.setState({
          swiperList: body
        })
      }
    }, 500)
  }
  async getGroups() {
    const res = await axios.get('http://localhost:8080/home/groups?', {
      params: {
        area: this.state.currentCity.value
      }
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState(
        {
          groupList: body
        },
        () => {
          // console.log(this.state.groupList)
        }
      )
    }
  }
  async getNews() {
    const res = await axios.get('http://localhost:8080/home/news', {
      params: {
        area: this.state.currentCity.value
      }
    })
    const { status, body } = res.data
    if (status === 200) {
      this.setState(
        {
          newsList: body
        },
        () => {
          // console.log(this.state.newsList)
        }
      )
    }
  }

  renderSwipers() {
    if (this.state.swiperList.length === 0) {
      return <div className="loadSwipers">加载中...</div>
    }
    return (
      <Carousel autoplay infinite>
        {this.state.swiperList.map(item => (
          <a
            key={item.id}
            href="http://www.alipay.com"
            style={{
              display: 'inline-block',
              width: '100%',
              height: this.state.imgHeight
            }}
          >
            <img
              src={`${BASE_URL + item.imgSrc}`}
              alt=""
              style={{ width: '100%', verticalAlign: 'top' }}
              onLoad={() => {
                // fire window resize event to change height
                window.dispatchEvent(new Event('resize'))
                this.setState({ imgHeight: 'auto' })
              }}
            />
          </a>
        ))}
      </Carousel>
    )
  }
  renderGroups() {
    return (
      <>
        {/* 标题 */}
        <h3 className="group-title">
          租房小组
          <span className="more">更多</span>
        </h3>
        {/* 内容 */}
        <div className="group-content">
          <Grid
            data={this.state.groupList}
            columnNum={2}
            square={false}
            hasLine={false}
            renderItem={(el, index) => (
              <Flex className="group-item" justify="around">
                <div className="desc">
                  <p className="title">{el.title}</p>
                  <span className="info">{el.desc}</span>
                </div>
                <img src={BASE_URL + el.imgSrc} alt="" />
              </Flex>
            )}
          />
        </div>
      </>
    )
  }
  renderNews() {
    return (
      <>
        <h3 className="news-title">最新资讯</h3>
        {this.state.newsList.map(item => (
          <div className="news-item" key={item.id}>
            <div className="imgwrap">
              <img className="img" src={BASE_URL + item.imgSrc} alt="" />
            </div>
            <Flex className="content" direction="column" justify="between">
              <h3 className="title">{item.title}</h3>
              <Flex className="info" justify="between">
                <span>{item.from}</span>
                <span>{item.date}</span>
              </Flex>
            </Flex>
          </div>
        ))}
      </>
    )
  }
  renderSearch() {
    return (
      <Flex className="search-box">
        <Flex className="search-form">
          <div
            className="location"
            onClick={() => {
              this.props.history.push('/city')
            }}
          >
            <span className="name">{this.state.currentCity.label}</span>
            <i className="iconfont icon-arrow"> </i>
          </div>
          <div className="search-input">
            <i className="iconfont icon-search" />
            <span className="text">请输入小区地址</span>
          </div>
        </Flex>
        {/* 地图小图标 */}
        <i
          className="iconfont icon-map"
          onClick={() => this.props.history.push('/map')}
        />
      </Flex>
    )
  }
  nav() {
    return (
      <Flex>
        {navList.map(item => (
          <Flex.Item
            key={item.title}
            onClick={() => this.props.history.push(item.path)}
          >
            <img src={item.icon} alt="" />
            <p>{item.title}</p>
          </Flex.Item>
        ))}
      </Flex>
    )
  }

  render() {
    return (
      <div className={styles.index}>
        {/* 轮播图 */}
        <div className="carousel" style={{ height: this.state.imgHeight }}>
          {this.renderSearch()}
          {this.renderSwipers()}
        </div>
        {/* 导航栏 */}
        <div className="nav">{this.nav()}</div>

        {/* 租房小组 */}
        <div className="group">{this.renderGroups()}</div>
        {/* 最新资讯 */}
        <div className="news">{this.renderNews()}</div>
      </div>
    )
  }
}
export default Index
