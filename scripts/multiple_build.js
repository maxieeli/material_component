const { readdirSync } = require('fs')
const { join } = require('path')
const exec = require('child_process').exec

const build = () => {
  const pkgs = readdirSync(join(__dirname, '../packages')).filter((pkg) => pkg.charAt(0) !== '.')

  pkgs.forEach((shortName) => {
    const pkgPath = join(__dirname, '..', 'packages', shortName)
    exec('yarn build', { cwd: pkgPath }, function(error, stdout, stderr) {
      if (error) {
        console.log(stderr)
        return
      }
      console.log(`run ${pkgPath} success`)
    })
  })
}

build()
