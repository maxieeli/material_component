const { existsSync, readdirSync, rmdir } = require('fs')
const { join } = require('path')

const remove = () => {
  const pkgs = readdirSync(join(__dirname, '../packages')).filter((pkg) => pkg.charAt(0) !== '.')

  pkgs.forEach((shortName) => {
    const pkgPath = join(__dirname, '..', 'packages', shortName, 'node_modules')
    if (existsSync(pkgPath)) {
      rmdir(pkgPath, { recursive: true }, (err) => {
        console.log(err)
      })
    }
  })
}

remove()