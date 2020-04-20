import React from 'react'
import './index.scss'

class Map extends React.Component {
  render() {
    return (
      <div className="map">
        <div id="container"></div>
      </div>
    )
  }
  componentDidMount() {
    const map = new window.BMap.Map('container')
    console.log(map)
    const point = new window.BMap.Point(117.143105, 30.822013)
    map.centerAndZoom(point, 15)
  }
}

export default Map
