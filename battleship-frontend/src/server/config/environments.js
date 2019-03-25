import merge from 'lodash.merge'

const development = {
  port: 4000
};

const test = merge({}, development, {

});

const production = {
  port: process.env.PORT || 8080
};

const stage = merge({}, production, {

});

export default {
  development,
  test,
  production,
  stage,
}
