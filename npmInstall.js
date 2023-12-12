const { exec } = require('node:child_process')

startMicroservice("m1")
startMicroservice("m2")

function startMicroservice(serviceName) {
    exec(
        `start cmd /k "cd ${serviceName}&&npm i"`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                return
            }
        }
    )
}
exec('npm i')