const fabric = require('@umijs/fabric')

module.exports = {
  ...fabric.prettier,
  "semi": false,
  "singleQuote": true,
  "jsxSingleQuote": true,
  "tabWidth": 2,
  "printWidth": 100
}
