import express from "express"
import Whatsapp from "whatsapp-web.js"
const { Client, LocalAuth } = Whatsapp
import { Server } from "socket.io"
import { toDataURL } from "qrcode"
import { createServer } from "http"
import { findRatingsById, formatTimestamp, ratingsFind } from "./utils.js"
import reply from "./reply.js"

const dirname = import.meta.dirname
const app = express()
const server = createServer(app)
const io = new Server(server)
const port = 3000
let status = 'Server baru dinyalakan...'
let lastMessageTime = {}
let qrcode = null

setInterval(() => {
    io.emit('last-seen', {timestamp: formatTimestamp(new Date()), status})
}, 1000);

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth()
})

app.use(express.static(dirname))

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: dirname })
})

app.get("/data-ratings", async (req, res) => {
    const ratings = await ratingsFind()
    res.send({data: ratings.map(x => ({userId: x.userId, rating: x.rating, timestamp: formatTimestamp(x.timestamp)}))})
})

app.get("/qrcode", async (req, res) => {
    res.send({data: qrcode})
})

client.on('ready', () => {
    console.log('Client siap!')
    status = 'Client siap!'
})

client.on('qr', qr => {
    toDataURL(qr, (err, url) => {
        qrcode = url
        io.emit("qr", url)
        status = 'Silahkan pindai!'
    })
    console.log(
        "\x1b[33mAyo pergi untuk memindai, \x1b[0msilahkan kunjungi\x1b[36m",
        `http://localhost:${port}\x1b[0m`, Date.now()
    )
})

client.on('message_create', async message => {
    const chatId = message.from

	await reply(client, message)

    if (lastMessageTime[chatId]) {
        clearTimeout(lastMessageTime[chatId])
    }


    if (!message.fromMe) {
        const userExist = await findRatingsById(ratings, message.from)

        lastMessageTime[chatId] = setTimeout(() => {
            client.sendMessage(chatId, `Terima kasih sudah menggunakan Layanan Konsultasi Kecamatan Magelang Utara. Jika ada yang bisa dibantu kembali, silahkan ketik “y”. 

${!userExist && 'Silahkan nilai aplikasi kami dengan mengetik _nilai<spasi>Angka_\n'} Sampai jumpa 😊`)}, 180000)
    }
})

client.initialize().then(res => {
    console.log('Menunggu Whatsapp...')
    if (!qrcode) status = 'Menghubungkan dengan Whatsapp...'
})
server.listen(port, () => {
    console.log("==================================")
    console.log(
        "\x1b[33mServer\x1b[36m",
        `http://localhost:${port}\x1b[0m`,
        '\x1b[33msiap!\x1b[0m'
    )
    console.log("==================================")
})