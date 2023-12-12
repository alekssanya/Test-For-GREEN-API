require('dotenv').config()
const express = require('express')
const amqplib = require('amqplib')
const PORT = process.env.PORT
const RABBIT_URL = process.env.RABBIT_URL
const app = express()
const producerQueueName = 'M2'
const consumerQueueName = 'M1'

start()
receiveMessage()

async function createConnection(queueName) {
    const connection = await amqplib.connect(RABBIT_URL)
    const channel = await connection.createChannel()
    await channel.assertQueue(queueName)
    return channel
}

async function sendMessage(message) {
    console.log("Подготавливается сообщение из M2")
    const channel = await createConnection(producerQueueName)
    console.log("5 секунд задержки")
    setTimeout(() => {
        console.log("5 секунд задержки прошли")
        channel.sendToQueue(producerQueueName, Buffer.from(String(message * 2))) //умножаем число на два
        console.log("Сообщение отправлено \n")
    }, 5000) // ждём 5 секунд перед отправкой из M2 согласно заданию
}

async function receiveMessage() {
    const channel = await createConnection(consumerQueueName)
    channel.consume(consumerQueueName, (msg) => {
        const receivedMsg = msg.content.toString()
        console.log("Получено сообщение из M1: " + receivedMsg + "\n")
        sendMessage(receivedMsg)
        channel.ack(msg)
    })
}

async function start() {
    try {
        app.listen(PORT, () => console.log('Server start on port: ' + PORT))
    } catch (error) {
        console.log(error)
    }
}