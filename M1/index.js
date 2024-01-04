require('dotenv').config()
const express = require('express')
const amqplib = require('amqplib')
const PORT = process.env.PORT
const RABBIT_URL = process.env.RABBIT_URL
const app = express()
const producerQueueName = 'M1'
const consumerQueueName = 'M2'
app.use(express.json())

start()
receiveMessage()

async function createConnection(queueName) {
    const connection = await amqplib.connect(RABBIT_URL)
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName)
    return channel
}

async function sendMessage(message) {
    console.log("Подготавливается сообщение из M1")
    const channel = await createConnection(producerQueueName)
    channel.sendToQueue(producerQueueName, Buffer.from(message))
    console.log("Сообщение из M1 отправлено \n")
}

async function receiveMessage() {
    const channel = await createConnection(consumerQueueName)
    channel.consume(consumerQueueName, (msg) => {
        const receivedMsg = msg.content.toString()
        console.log("Получено сообщение из M2: " + receivedMsg + "\n")
        channel.ack(msg)
    })
}

app.post('/', (req, res) => {
    sendMessage(req.body.number)
    console.log(req.body.number)
    return res.status(200).send({message: "Число передано в m1"})
})

async function start() {
    try {
        app.listen(PORT, () => console.log('Server start on port: ' + PORT))
    } catch (error) {
        console.log(error)
    }
}