import express from "express";
import Whatsapp from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = Whatsapp;
import { Server } from "socket.io";
import { toDataURL } from "qrcode";
import { createServer } from "http";

const app = express();
const server = createServer(app);
const io = new Server(server);
const port = 3000
let lastMessageTime = {}; // chatId pengguna akan disimpan disini

const client = new Client({
    puppeteer: {
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
    authStrategy: new LocalAuth()
});

app.use(express.static(import.meta.dirname))

app.get("/", (req, res) => {
    res.sendFile("index.html", { root: import.meta.dirname });
});

client.on('ready', () => {
    console.log('Client siap!');
    io.emit("status", "Client siap!");
});

client.on('qr', qr => {
    toDataURL(qr, (err, url) => {
        io.emit("qr", url);
        io.emit("status", "Silahkan pindai!");
    });
    console.log(
        "\x1b[33mAyo pergi untuk memindai, \x1b[0msilahkan kunjungi\x1b[36m",
        `http://localhost:${port}\x1b[0m`, Date.now()
    );
});

client.on('message_create', async message => {
	const text = message.body.toLowerCase();
    console.log('incoming message', text)
    const chatId = message.from;

	if (text === 'ping' || text === 'p') {
		client.sendMessage(message.from, 'pong');
	}
    if (text === 'y') {
        client.sendMessage(
        message.from,
        `Selamat Datang di Layanan Aduan dan Konsultasi Kecamatan Magelang Utara. Silahkan pilih Menu dibawah ini
Ketik angka untuk memilih Menu Layanan 
1.Layanan Aduan 
2.Layanan Konsultasi`
        );
    } 
    if (text === "1") {
        client.sendMessage(
        message.from,
        "Untuk Layanan Aduan, silahkan mengisi data diri Anda terlebih dahulu melalui link form berikut ini \https://forms.gle/QrquLQyXA4dp4ZgbA\nTerima kasih telah menggunakan layanan aduan dan konsultasi Kecamtan Magelang Utara"
        );
    } 
    if (text === "2") {
        client.sendMessage(
        message.from,
        `Selamat Datang di Menu Layanan Konsultasi Kecamatan Magelang Utara. Silahkan pilih menu jenis layanan administrasi yang ingin dikonsultasikan.
Pilih Menu dengan memilih nomor sesuai dengan jenis layanan
3.Dispensasi Nikah
4.Surat Keterangan Tidak Mampu
5.Surat Keterangan Waris Tanah
6.Surat Keterangan Waris Tabungan
7.Surat Keterangan Waris Satu Orang Beda Nama
8.Surat Keterangan Administrasi Umum
9.Surat Keterangan Domisili Usaha
10.Tanya Admin/Operator`
        );
    } 
    if (text === "3") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-dispensasi-nikah.jpg"
        );
        await client.sendMessage(message.from, media)
    }
    if (text === "4") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-tidak-mampu.jpg"
        );
        await client.sendMessage(message.from, media)
    }

    if (text === "5") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-waris-tanah.jpg"
        );
        await client.sendMessage(message.from, media)
    }
    
    if (text === "6") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-waris-tabungan.jpg"
        );
        await client.sendMessage(message.from, media)
    }
    
    if (text === "7") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-waris-satu-orang-beda-nama.jpg"
        );
        await client.sendMessage(message.from, media)
    }
    
    if (text === "8") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-administrasi-umum.jpg"
        );
        await client.sendMessage(message.from, media)
    }
    
    if (text === "9") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-domisili-usaha.jpg"
        );
        await client.sendMessage(message.from, media)
    }
    
    if (text === "10") {
        await client.sendMessage(message.from, "Untuk Layanan Konsultasi Tanya Admin, silahkan mengisi formulir berikut ini:\https://forms.gle/QrquLQyXA4dp4ZgbA\nuntuk selanjutnya akan dijawab langsung oleh admin pada jam kerja \n Terima kasih telah menggunakan layanan aduan dan konsultasi Kecamtan Magelang Utara");
    }

    if (lastMessageTime[chatId]) {
        clearTimeout(lastMessageTime[chatId]);
    }

    if (!message.fromMe) {
        lastMessageTime[chatId] = setTimeout(() => {
            client.sendMessage(chatId, `Terima kasih sudah menggunakan Layanan Konsultasi Kecamatan Magelang Utara. Jika ada yang bisa dibantu kembali, silahkan ketik “y”. 

Sampai jumpa 😊`)}, 180000);
    }
});


client.initialize();
server.listen(port, () => {
    console.log("==================================");
    console.log(
        "\x1b[33mServer\x1b[36m",
        `http://localhost:${port}\x1b[0m`,
        '\x1b[33msiap!\x1b[0m'
    );
    console.log("==================================");
});