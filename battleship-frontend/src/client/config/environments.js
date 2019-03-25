import { merge } from 'lodash'

const development = {
  api: {
    baseURL: 'http://localhost:4000/api'
  }
}

const test = merge({}, development, {

})

const production = {
  api: {
    baseURL: ''
  }
}

const stage = merge({}, production, {

})

export default {
  development,
  test,
  production,
  stage
}
