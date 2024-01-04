const { exec } = require('node:child_process')
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
})
const myURLRabbitMQ = "amqps://eygbcnfp:fmSKEbpqkyfmi02ajeQvMMfhqPCLio35@kangaroo.rmq.cloudamqp.com/eygbcnfp"
const portM1 = 8001
const portM2 = 8002
let firstProccessIsEnd = false
let userURLRabbitMQ

rl.question("Введите URL RabbitMQ или нажмите Enter: ", function (rabbitURL) {
    let userURLRabbitMQ = rabbitURL
    startMicroservice("m1")
    startMicroservice("m2")
    rl.close
})

function startMicroservice(serviceName) {
    exec(
        `start cmd /k "cd ${serviceName}&&npm i&&echo Port=${serviceName == 'm1' ? portM1 : portM2} > .env&&echo RABBIT_URL=${userURLRabbitMQ || myURLRabbitMQ} >> .env&&exit"`,
        (error, stdout, stderr) => {
            exit()
        }
    )

}

function exit() {
    firstProccessIsEnd ? process.exit(0) : firstProccessIsEnd = true
}
