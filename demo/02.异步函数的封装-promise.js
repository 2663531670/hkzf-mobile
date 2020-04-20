// 封装一个read函数，传入一个文件名，返回读取的结果

// 解决方法2：promise

const fs = require('fs')
function read(name) {
  return new Promise((resolve, reject) => {
    fs.readFile(name, 'utf8', (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

read('a.txt')
  .then(data => {
    console.log(data)
  })
  .catch(err => {
    console.log(err)
  })
