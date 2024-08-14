import Whatsapp from "whatsapp-web.js"
const { MessageMedia } = Whatsapp
import fs from 'fs/promises'

export default async function reply(client, message) {
    const text = message.body.toLowerCase()
    console.log('incoming message', text)
    
    if (text === 'ping' || text === 'p') {
		client.sendMessage(message.from, 'pong')
	}
    if (text === 'y') {
        client.sendMessage(
        message.from,
        `Selamat Datang di Layanan Aduan dan Konsultasi Kecamatan Magelang Utara. Silahkan pilih Menu dibawah ini
Ketik angka untuk memilih Menu Layanan 
1.Layanan Aduan 
2.Layanan Konsultasi`
        )
    } 
    if (text === "1") {
        client.sendMessage(
        message.from, `Untuk Layanan Aduan, silahkan mengisi data diri Anda terlebih dahulu melalui link form berikut ini
https://forms.gle/Csa6de5Q28ceGm9q7`
        )
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
        )
    } 
    if (text === "3") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-dispensasi-nikah.jpg"
        )
        await client.sendMessage(message.from, media)
    }
    if (text === "4") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-tidak-mampu.jpg"
        )
        await client.sendMessage(message.from, media)
    }

    if (text === "5") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-waris-tanah.jpg"
        )
        await client.sendMessage(message.from, media)
    }
    
    if (text === "6") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-waris-tabungan.jpg"
        )
        await client.sendMessage(message.from, media)
    }
    
    if (text === "7") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-waris-satu-orang-beda-nama.jpg"
        )
        await client.sendMessage(message.from, media)
    }
    
    if (text === "8") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-administrasi-umum.jpg"
        )
        await client.sendMessage(message.from, media)
    }
    
    if (text === "9") {
        const media = MessageMedia.fromFilePath(
            "./assets/surat-keterangan-domisili-usaha.jpg"
        )
        await client.sendMessage(message.from, media)
    }
    
    if (text === "10") {
        await client.sendMessage(message.from, `Untuk Layanan Konsultasi Tanya Admin, silahkan mengisi formulir berikut ini:
https://forms.gle/Csa6de5Q28ceGm9q7

untuk selanjutnya akan dijawab langsung oleh admin pada jam kerja
`)
    }

    if (text.startsWith('nilai') && !message.fromMe) {
        const nilai = Number(text.split(' ')[1])
        if (!nilai) {
            return await client.sendMessage(message.from, `Nilai layanan kami antara 1 hingga 5 dengan format _nilai<spasi>Angka_
    
contoh:
nilai 5
nilai 4
nilai 3
nilai 2
nilai 1`)
        }
        if (nilai < 1 || nilai > 5) {
            return await client.sendMessage(message.from, "Nilai yang kamu masukkan tidak pas. Masukkan nilai antara 1 hingga 5 dengan format _nilai<spasi>Angka_")
        }
    
        try {
            let ratings = await ratingsFind()
            const userExist = await findUserFromDataById(ratings, message.from)

            if (userExist) ratings = ratings.filter(rating => rating.userId !== message.from)
            ratings.push({
                userId: message.from,
                rating: nilai,
                timestamp: new Date().toISOString()
            })

    
            await fs.writeFile(filePath, JSON.stringify(ratings, null, 2))
    
            await client.sendMessage(message.from, `Terima kasih atas penilaian Anda. Nilai ${nilai} telah disimpan.`)
        } catch (error) {
            console.error('Error menyimpan nilai:', error)
            await client.sendMessage(message.from, 'Maaf, terjadi kesalahan saat menyimpan penilaian Anda.')
        }
    }
}