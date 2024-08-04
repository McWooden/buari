import express from "express";
import Whatsapp from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = Whatsapp;
import { Server } from "socket.io";
import { toDataURL } from "qrcode";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server);

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }
});

app.use(express.static(import.meta.dirname));

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: import.meta.dirname });
});

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    toDataURL(qr, (err, url) => {
        io.emit("qr", url);
        io.emit("status", "Silahkan pindai!");
    });
    console.log("QR RECEIVED", Date.now(), qr);
});

client.on('message_create', message => {
	if (message.body === 'ping') {
		// send back "pong" to the chat the message was sent in
		client.sendMessage(message.from, 'pong');
	}
});


client.initialize();
const port = 3000;
server.listen(port, () => {
  console.log("====================================================");
  console.log(
    "\x1b[33mServer siap, \x1b[0msilahkan kunjungi\x1b[36m",
    `http://localhost:${port}\x1b[0m`
  );
  console.log("====================================================");
});
