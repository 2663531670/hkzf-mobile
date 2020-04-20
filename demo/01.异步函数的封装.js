// 封装一个read函数，传入一个文件名，返回读取的结果

// 解决方法1：回调函数

const fs = require('fs')
function read(name, callback) {
  fs.readFile(name, 'utf-8', (err, data) => {
    if (err) {
      callback(err)
    } else {
      callback(data)
    }
  })
}
read('a.txt', res => {
  console.log(res)
})
read('b.txt', res => {
  console.log(res)
})
