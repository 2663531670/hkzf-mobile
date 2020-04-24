import React from 'react'
import styles from './index.module.scss'
import NavHeader from 'common/NavHeader'
import { getCurrentCity } from 'utils/current_city'
import axios from 'axios'
const BMap = window.BMap
class Map extends React.Component {
  render() {
    return (
      <div className={styles.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container"></div>
      </div>
    )
  }
  async componentDidMount() {
    const map = new BMap.Map('container')
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
          const res = await axios.get('http://localhost:8080/area/map', {
            params: {
              id: city.value
            }
          })
          res.data.body.forEach(item => {
            // 根据获取到的下一级数据添加覆盖物
            const opts = {
              position: new BMap.Point(
                item.coord.longitude,
                item.coord.latitude
              ),
              offset: new BMap.Size(0, 0)
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
            map.addOverlay(label)
            label.addEventListener('click', () => {
              // 点击先修改中心点和缩放级别，在清楚所有覆盖物
              map.centerAndZoom(
                new BMap.Point(item.coord.longitude, item.coord.latitude),
                13
              )
              // 清楚所有覆盖物
              setTimeout(() => {
                map.clearOverlays()
              }, 0)

              // 再发送请求获取下一级镇数据
              axios
                .get('http://localhost:8080/area/map', {
                  params: {
                    id: item.value
                  }
                })
                .then(res => {
                  const { status, body } = res.data
                  if (status === 200) {
                    body.forEach(item => {
                      const opts = {
                        position: new BMap.Point(
                          item.coord.longitude,
                          item.coord.latitude
                        ),
                        offset: new BMap.Size(0, 0)
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
                      map.addOverlay(label)
                      label.addEventListener('click', () => {
                        // 点击先修改中心点和缩放级别，在清楚所有覆盖物
                        map.centerAndZoom(
                          new BMap.Point(
                            item.coord.longitude,
                            item.coord.latitude
                          ),
                          15
                        )
                        // 清楚所有覆盖物
                        setTimeout(() => {
                          map.clearOverlays()
                        }, 0)
                        // 再发送请求获取下一级镇数据
                        axios
                          .get('http://localhost:8080/area/map', {
                            params: {
                              id: item.value
                            }
                          })
                          .then(res => {
                            const { status, body } = res.data
                            if (status === 200) {
                              body.forEach(item => {
                                const opts = {
                                  position: new BMap.Point(
                                    item.coord.longitude,
                                    item.coord.latitude
                                  ),
                                  offset: new BMap.Size(0, 0)
                                }
                                const label = new BMap.Label(
                                  `<div class="rect">
                        <span class="housename">${item.label}</span>
                      <span class="housenum">${item.count}套</span>
                      <i class="arrow"></i>
                    </div>`,
                                  opts
                                )
                                label.setStyle({
                                  border: '0px solid rgb(255, 0, 0)',
                                  padding: '0px'
                                })
                                map.addOverlay(label)
                                label.addEventListener('click', () => {
                                  console.log('小区房源信息展示了')
                                })
                              })
                            }
                          })
                      })
                    })
                  }
                })
            })
          })

          // 发送请求获取城市下所有区的信息
        }
      },
      city.label
    )
    // const point = new window.BMap.Point(117.143105, 30.822013)
  }
}

export default Map
