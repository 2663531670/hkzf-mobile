import React from 'react'
import styles from './index.module.scss'
import NavHeader from 'common/NavHeader'
import { getCurrentCity } from 'utils/current_city'
import axios from 'axios'
import { Toast } from 'antd-mobile'
import { BASE_URL } from 'utils/config'
const BMap = window.BMap
class Map extends React.Component {
  state = {
    isShow: false,
    houseList: []
  }
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container"></div>
        {/* 房源列表信息展示 */}
        <div className={this.state.isShow ? 'houseList show' : 'houseList'}>
          <div className="titleWrap">
            <h1 className="listTitle">房屋列表</h1>
            <a className="titleMore" href="/house/list">
              更多房源
            </a>
          </div>
          <div className="houseItems">
            {this.state.houseList.map(item => (
              <div className="house" key={item.houseCode}>
                <div className="imgWrap">
                  <img className="img" src={BASE_URL + item.houseImg} alt="" />
                </div>
                <div className="content">
                  <h3 className="title">{item.title}</h3>
                  <div className="desc">{item.desc}</div>
                  <div>
                    {item.tags.map((tag, index) => (
                      <span className={`tag tag${(index % 3) + 1}`} key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="price">
                    <span className="priceNum">{item.price}</span> 元/月
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
  async componentDidMount() {
    const map = new BMap.Map('container')
    this.map = map
    const myGeo = new BMap.Geocoder()
    const city = await getCurrentCity()
    myGeo.getPoint(
      city.label,
      async point => {
        if (point) {
          map.centerAndZoom(point, 11)
          // 添加地图控件
          var control = new BMap.ScaleControl()
          var navigation = new BMap.NavigationControl()
          map.addControl(control)
          map.addControl(navigation)
          Toast.loading('拼命加载中...', 0)
          // 发送请求获取城市下所有区的信息
          map.addEventListener('movestart', () => {
            this.setState({
              isShow: false
            })
          })
          this.renderOverlays(city.value)
        }
      },
      city.label
    )
  }
  async renderOverlays(id) {
    const { type, nextZoom } = this.getTypeAndZoom()
    const res = await axios.get('http://localhost:8080/area/map', {
      params: {
        id
      }
    })
    res.data.body.forEach(item => {
      this.addOverlay(item, type, nextZoom)
    })
    Toast.hide()
  }
  getTypeAndZoom() {
    const zoom = this.map.getZoom()
    let type, nextZoom
    if (zoom === 11) {
      type = 'circle'
      nextZoom = 13
    } else if (zoom === 13) {
      type = 'circle'
      nextZoom = 15
    } else {
      type = 'rect'
      nextZoom = 15
    }
    return { type, nextZoom }
  }
  addOverlay(item, type, nextZoom) {
    if (type === 'circle') {
      this.addCircle(item, nextZoom)
    } else {
      this.addRect(item, nextZoom)
    }
  }
  addCircle(item, nextZoom) {
    // console.log('添加圆形覆盖物', item, nextZoom)
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const opts = {
      position: point,
      offset: new BMap.Size(-35, -35)
    }
    const label = new BMap.Label(
      `<div class="bubble">
    <p class="name">${item.label}</p>
    <p>${item.count}套</p>
  </div>`,
      opts
    )
    label.setStyle({
      border: '0px solid rgb(255, 0, 0)',
      padding: '0px'
    })
    this.map.addOverlay(label)
    // 添加点击事件
    label.addEventListener('click', () => {
      // 修改中心点和缩放级别
      this.map.centerAndZoom(point, nextZoom)

      // 清楚所有覆盖物
      setTimeout(() => {
        this.map.clearOverlays()
      })
      Toast.loading('玩命加载中...', 0)
      this.renderOverlays(item.value)
    })
  }

  addRect(item, nextZoom) {
    console.log('添加方形覆盖物', item, nextZoom)
    const point = new BMap.Point(item.coord.longitude, item.coord.latitude)
    const opts = {
      position: point,
      offset: new BMap.Size(-50, -22)
    }
    const label = new BMap.Label(
      `<div class="rect">
    <span class="housename">${item.label}</span>
	<span class="housenum">${item.count} 套</span>
	<i class="arrow"></i>
</div>`,
      opts
    )
    label.setStyle({
      border: '0px solid rgb(255, 0, 0)',
      padding: '0px'
    })
    this.map.addOverlay(label)

    label.addEventListener('click', e => {
      const x = window.innerWidth / 2 - e.changedTouches[0].pageX
      const y =
        (window.innerHeight - 330 - 45) / 2 - (e.changedTouches[0].pageY - 45)
      this.map.panBy(x, y)
      // 发送请求获取房源信息
      Toast.loading('玩命加载中...', 0)
      axios
        .get('http://localhost:8080/houses', {
          params: {
            cityId: item.value
          }
        })
        .then(res => {
          console.log(res.data)
          this.setState({
            houseList: res.data.body.list,
            isShow: true
          })
          Toast.hide()
        })
      // this.setState({
      //   isShow: true
      // })
    })
  }
}

export default Map
