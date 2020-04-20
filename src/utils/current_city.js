import axios from 'axios'
const CURRENT_CITY = 'current_city'

export function setCity(city) {
  localStorage.setItem(CURRENT_CITY, JSON.stringify(city))
}

export function getCurrentCity(callback) {
  return new Promise((resolve, reject) => {
    const city = JSON.parse(localStorage.getItem(CURRENT_CITY))
    if (city) {
      resolve(city)
      callback && callback(city)
    } else {
      const myCity = new window.BMap.LocalCity()
      myCity.get(result => {
        axios
          .get(`http://localhost:8080/area/info?name=${result.name}`)
          .then(res => {
            const { status, body } = res.data
            if (status === 200) {
              setCity(body)
              resolve(body)
              callback && callback(body)
            }
          })
      })
    }
  })
}

export function getCurrentCity1(callback) {
  const city = JSON.parse(localStorage.getItem('current_city'))
  if (city) {
    callback(city)
  } else {
    // 根据百度地图获取当前定位城市
    const myCity = new window.BMap.LocalCity()
    myCity.get(async result => {
      const res = await axios.get(
        `http://localhost:8080/area/info?name=${result.name}`
      )
      const { status, body } = res.data
      if (status === 200) {
        localStorage.setItem('current_city', JSON.stringify(body))
        callback(body)
      }
    })
  }
}
