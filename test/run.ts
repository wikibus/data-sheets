import { spawn } from 'child_process'
import program from 'commander'
import dotenv from 'dotenv'

dotenv.config()

program.option('--grep <pattern>', 'RegExp to filter the test cases')

program.parse(process.argv)

const scenarios = Object.entries({
  'DataSheet/CreateRename': '',
})

const selectedScenarios = scenarios
  .filter(([ scenario ]) => {
    if (program.grep) {
      return scenario.match(program.grep)
    }

    return true
  })

function parseScenarios () {
  return new Promise((resolve, reject) => {
    console.log(`\n------\n   Compiling test scenarios\n------\n`)
    const childProcess = spawn('hypertest-compiler', ['test'], { stdio: 'inherit' })

    childProcess.on('exit', code => {
      if (code === 0) {
        resolve()
      }

      reject(new Error('Failed to compile test scenarios'))
    })
  })
}

function runScenarios () {
  return selectedScenarios.reduce((promise, [scenario, path]) => {
    return promise.then(() => {
      return new Promise(async (resolve, reject) => {
        const command = `hydra-validator e2e --docs test/${scenario}.hydra.json ${process.env.BASE_URI}${path}`
        console.log(`\n------\n   ${command}\n------\n`)

        const childProcess = spawn(
          `hydra-validator`,
          [`e2e`, `--docs`, `test/${scenario}.hydra.json`, `${process.env.BASE_URI}${path}`, '--strict'],
          { stdio: 'inherit' })

        childProcess.on('exit', code => {
          if (code === 0) {
            resolve()
          }

          reject(new Error('Last scenario failed. Stopping'))
        })
      })
    })
  }, Promise.resolve())
}

parseScenarios()
  .then(runScenarios)
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
