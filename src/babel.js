const start = async () => {
  return await Promise.resolve('async is working')
}

start().then(console.log)

const unused = false

class Util {
  static id = Date.now()
}

console.log('Util Id: ', Util.id)
console.log(unused)


import('lodash').then((_) => { // lazy-loading import (идет по умолчанию в webpack), создано для оптимизации загрузки кода
  console.log('Lodash: ', _.default.random(0, 100, true))
})