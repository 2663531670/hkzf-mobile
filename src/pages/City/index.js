import React from 'react'
import axios from 'axios'
import styles from './index.module.scss'
import { Toast } from 'antd-mobile'
import NavHeader from 'common/NavHeader'
import { getCurrentCity, setCity } from 'utils/current_city'
import { AutoSizer, List } from 'react-virtualized'

const TITLE_HEIGHT = 36
const CITY_HEIGHT = 50

class City extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cityArr: [],
      cityObj: {},
      currentIndex: 0
    }
    this.ListRef = React.createRef()
  }
  componentDidMount() {
    this.getCityList()
  }

  async getCityList() {
    const res = await axios.get('http://localhost:8080/area/city?level=1')
    const { status, body } = res.data
    if (status === 200) {
      const { cityArr, cityObj } = this.parseCityList(body)

      // 处理热门城市
      cityArr.unshift('hot')
      const result = await axios.get('http://localhost:8080/area/hot')
      cityObj['hot'] = result.data.body

      // 处理当前定位的城市
      cityArr.unshift('#')
      const city = await getCurrentCity()
      cityObj['#'] = [city]
      this.setState(
        {
          cityArr,
          cityObj
        },
        () => {
          this.ListRef.current.measureAllRows()
        }
      )
    }
  }

  parseCityList(body) {
    const cityObj = {}
    body.forEach(item => {
      const short = item.short.slice(0, 1)
      if (short in cityObj) {
        cityObj[short].push(item)
      } else {
        cityObj[short] = [item]
      }
    })
    const cityArr = Object.keys(cityObj).sort()
    return {
      cityObj: cityObj,
      cityArr: cityArr
    }
  }
  // 处理标题
  parseTitle(title) {
    if (title === '#') {
      return '当前定位'
    } else if (title === 'hot') {
      return '热门城市'
    } else {
      return title.toUpperCase()
    }
  }
  // 处理每一行高度
  calcHeight({ index }) {
    const { cityArr, cityObj } = this.state
    const short = cityArr[index]
    const arr = cityObj[short]
    return TITLE_HEIGHT + CITY_HEIGHT * arr.length
  }
  // 长列表渲染
  rowRenderer({ key, index, isScrolling, isVisible, style }) {
    const short = this.state.cityArr[index]
    const citys = this.state.cityObj[short]
    return (
      <div key={key} style={style}>
        <div className="title">{this.parseTitle(short)}</div>
        {citys.map(item => (
          <div
            key={item.value}
            className="name"
            onClick={this.selectCity.bind(this, item)}
          >
            {item.label}
          </div>
        ))}
      </div>
    )
  }
  selectCity(city) {
    const HOT = ['北京', '上海', '广州', '深圳']
    if (HOT.includes(city.label)) {
      setCity(city)
      this.props.history.go(-1)
    } else {
      Toast.info('该城市暂无更多房源信息', 1)
    }
  }
  onRowsRendered({ startIndex }) {
    if (startIndex !== this.state.currentIndex) {
      this.setState({
        currentIndex: startIndex
      })
    }
  }
  handleClick(index) {
    this.ListRef.current.scrollToRow(index)
    this.setState({
      currentIndex: index
    })
  }
  render() {
    return (
      <div className={styles.city}>
        <NavHeader>城市选择</NavHeader>
        {/* 城市列表渲染 */}
        {this.state.cityArr.length > 0 ? (
          <div className="cityList">
            <AutoSizer>
              {({ height, width }) => (
                <List
                  width={width}
                  height={height}
                  rowCount={this.state.cityArr.length}
                  rowHeight={this.calcHeight.bind(this)}
                  rowRenderer={this.rowRenderer.bind(this)}
                  onRowsRendered={this.onRowsRendered.bind(this)}
                  scrollToAlignment="start"
                  ref={this.ListRef}
                />
              )}
            </AutoSizer>
            {/* 右侧快捷导航栏 */}
            <ul className="city-index">
              {this.state.cityArr.map((item, index) => (
                <li key={item} className="city-index-item">
                  <span
                    onClick={this.handleClick.bind(this, index)}
                    className={
                      index === this.state.currentIndex ? 'index-active' : ''
                    }
                  >
                    {item === 'hot' ? '热' : item.toUpperCase()}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="loading">加载中....</div>
        )}
      </div>
    )
  }
}

export default City
