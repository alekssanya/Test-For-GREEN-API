const { exec } = require('node:child_process')
const http = require('http')
const prompt = require('prompt-sync')({ sigint: true })

startMicroservice("m1")
startMicroservice("m2")

async function consoleInput() {
    while (true) {
        const num = prompt('Введите число: ');
        console.log(num)
        let res = await sendNumber(num)
        console.log(JSON.parse(res))
    }
}
consoleInput()

function httpPost({ body, ...options }) {
    return new Promise((resolve, reject) => {
        const req = http.request({
            method: 'POST',
            ...options,
        }, res => {
            const chunks = []
            res.on('data', data => chunks.push(data))
            res.on('end', () => {
                let resBody = Buffer.concat(chunks)
                switch (res.headers['content-type']) {
                    case 'application/json':
                        resBody = JSON.parse(resBody)
                        break
                }
                resolve(resBody)
            })
        })
        req.on('error', reject)
        if (body) {
            req.write(body)
        }
        req.end()
    })
}

async function sendNumber(num) {
    const res = await httpPost({
        hostname: 'localhost',
        port: 8001, // Порт сервиса M1
        path: '/',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            number: num,
        })
    })
    return res
}


function startMicroservice(serviceName) {
    exec(
        `start cmd /k "cd ${serviceName}&&npm run ${serviceName}"`,
        (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`)
                return
            }
        }
    )
}