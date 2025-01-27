/**
 * Original CreateBy @hiyaok X Luxurious 
 * Follow Original Creator Tik Tok @wztwentythree
 * Bug fixes and improvements by @hiyaok on Telegram
 * Last updated: January 2025
 * 
 * Features:
 * - User management with data persistence
 * - Channel subscription verification
 * - Random photo/audio/message sending
 * - Sticker creation with proper file handling
 * - Admin broadcast system
 * - User counting
 */

const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs').promises;  // For async operations
const fsSync = require('fs');       // For stream operations
const axios = require('axios');
const path = require('path');

// Bot configuration
const token = '7338690094:AAFcSFS3rI3RtvS4UpAKFiCcd9nwnpuevxg';
const CHANNEL_USERNAME = '@LuxuryDigitalCompany';
const ADMIN_ID = '7065487918';

// Initialize bot with error handling
const bot = new TelegramBot(token, {
    polling: true,
    filepath: false  // Prevents local file storage issues
});

// Data file path with proper path handling
const dataFile = path.join(__dirname, 'data.json');

// Content arrays
const photoUrls = [
    'https://files.catbox.moe/kgc9g1.jpg',
    'https://files.catbox.moe/0efyhf.jpg',
    'https://files.catbox.moe/2hbg9s.jpg',
    'https://files.catbox.moe/f9bi7e.jpg',
    'https://files.catbox.moe/cz9hkw.jpg',
    'https://files.catbox.moe/tea6d0.jpg',
    'https://files.catbox.moe/bn9akc.jpg',
    'https://files.catbox.moe/i23sm1.jpg',
    'https://files.catbox.moe/792tum.jpg',
    'https://files.catbox.moe/eyrd92.jpg',
    'https://files.catbox.moe/nuplcd.jpg',
    'https://files.catbox.moe/0ge7du.jpg',
    'https://files.catbox.moe/g061fc.jpg',
    'https://files.catbox.moe/2gzith.jpg',
    'https://files.catbox.moe/2p6ebl.jpg',
    'https://files.catbox.moe/dtyn8n.jpg',
];

const audioUrls = [
    'https://files.catbox.moe/6opnjd.mp3',
    'https://files.catbox.moe/to5ra0.mp3',
    'https://files.catbox.moe/vqhmav.mp3',
    'https://files.catbox.moe/tx7x5a.mp3',
    'https://files.catbox.moe/da72bh.mp3',
    'https://files.catbox.moe/0tihn9.mp3',
    'https://files.catbox.moe/nq0kmz.mp3',
];

const kataKata = [
    '"Tidak Perlu Menjadi Bintang Jadi lah awan yang menutupi para bintang"',
    '"Keberuntungan Datang Kepada Mereka Yang Berani"',
    '"Baik Buruknya Kita Hanya Roqib atid yang tau sisa nya hanya sok tau"',
    '"Lebih mengulang 1000 kali dari pada diam tanpa aksi"',
    '"Jika Inggin mendapatkannya tidur dan bermimpi lah"',
    '"Manusia tidak akan saling mengerti kecuali merasakan rasa sakit yang sama"',
    '"Janggan pernah berharap jika tidak ingin kecewa"',
    '"Sesakit apapun dirimu tetaplah tersenyum agar orang orang berfikir kamu baik baik saja"',
    '"Beda gaya beda cerita salah gaya masuk berita"',
    '"Fisik bisa berubah materi bisa di cari tapi yang tulus tidak datang dua kali"',
];

// User management functions
async function readUsers() {
    try {
        const exists = await fs.access(dataFile).then(() => true).catch(() => false);
        if (!exists) {
            await fs.writeFile(dataFile, JSON.stringify({ users: [] }, null, 2));
            return { users: [] };
        }
        const data = await fs.readFile(dataFile, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading users:', error);
        return { users: [] };
    }
}

async function saveUser(userId) {
    try {
        const data = await readUsers();
        if (!data.users.includes(userId)) {
            data.users.push(userId);
            await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
            console.log(`New user saved: ${userId}`);
            return true;
        }
        return false;
    } catch (error) {
        console.error('Error saving user:', error);
        return false;
    }
}

// Channel membership verification
async function checkChannelMembership(userId) {
    try {
        const member = await bot.getChatMember(CHANNEL_USERNAME, userId);
        return ['member', 'administrator', 'creator'].includes(member.status);
    } catch (error) {
        console.error('Error checking membership:', error);
        return false;
    }
}

// File download helper with proper stream handling
async function downloadFile(url, filePath) {
    try {
        const writer = fsSync.createWriteStream(filePath);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            timeout: 5000
        });

        return new Promise((resolve, reject) => {
            response.data.pipe(writer);
            writer.on('finish', resolve);
            writer.on('error', (error) => {
                writer.close();
                reject(error);
            });
        });
    } catch (error) {
        throw new Error(`Download failed: ${error.message}`);
    }
}

// Start command handler
bot.onText(/\/start/, async (msg) => {
    const chatId = msg.chat.id;
    
    try {
        await saveUser(msg.from.id);
        const isMember = await checkChannelMembership(msg.from.id);

        if (isMember) {
            const caption = `
╔═❍ ɪɴғᴏʀᴍᴀᴛɪᴏɴ 
╠ ɪᴅ : ${msg.from.id}
╠ ɴᴀᴍᴇ : ${msg.from.username || 'Tidak Ada'}
╙─┈━━━━━━┅┅┅┅━━⚇
┏━⏍ ʙᴀsɪᴄ ᴍᴇɴᴜ
┣⮕ /pap - ᴍᴇɴɢɪʀɪᴍ ᴘᴀᴘ
┣⮕ /sadvibes - ᴀᴜᴅɪᴏ sᴀᴅ
┣⮕ /katakata - ᴋᴀᴛᴀ ᴋᴀᴛᴀ
┗━━──━━━━─┉━━❐
▬▭▬▭▬▭▬▭▬▭▬▭
┏━⏍ ᴏᴛʜᴇʀ ᴍᴇɴᴜ
┣⮕ /totalusers - ᴊᴜᴍʟᴀʜ ᴜsᴇʀ
┣⮕ /brat - ʙᴜᴀᴛ sᴛɪᴋᴇʀ
┗━━──━━━━─┉━━❐
▬▭▬▭▬▭▬▭▬▭▬▭
┏━⏍ ᴏᴡɴᴇʀ ᴏɴʟʏ
┣⮕ /broadcast - ᴋʜᴜsᴜs ᴏᴡɴᴇʀ
┗━━──━━━━─┉━━❐`;

            const options = {
                reply_markup: {
                    inline_keyboard: [
                        [
                            { text: "𝙊𝙒𝙉𝙀𝙍", url: "http://t.me/LuxInGame" },
                            { text: "𝙐𝙎𝙀𝙍𝘽𝙊𝙏", url: "https://t.me/PromoteSaleLux/1988" }
                        ]
                    ]
                }
            };

            await bot.sendPhoto(chatId, 'https://files.catbox.moe/ugj3jl.jpg', { 
                caption: caption, 
                parse_mode: 'HTML',
                ...options 
            });
        } else {
            await bot.sendMessage(chatId, `
Sebelum menggunakan bot ini, Anda harus bergabung ke channel kami terlebih dahulu.
Silahkan klik "Gabung Channel" jika sudah klik "verification"`, {
                reply_markup: {
                    inline_keyboard: [
                        [{ text: "Gabung Channel 📩", url: `https://t.me/${CHANNEL_USERNAME.replace('@', '')}` }],
                        [{ text: "Verification ✅", callback_data: "check_subscription" }]
                    ]
                }
            });
        }
    } catch (error) {
        console.error("Error in /start command:", error);
        await bot.sendMessage(chatId, "Terjadi kesalahan. Silakan coba lagi nanti.");
    }
});

// Callback query handler
bot.on('callback_query', async (callbackQuery) => {
    const chatId = callbackQuery.message.chat.id;
    
    if (callbackQuery.data === "check_subscription") {
        try {
            const isMember = await checkChannelMembership(callbackQuery.from.id);
            
            if (isMember) {
                await bot.sendMessage(chatId, "Terima kasih telah bergabung! Silakan gunakan perintah /start untuk melihat menu.");
            } else {
                await bot.sendMessage(chatId, "Anda belum bergabung ke channel. Harap bergabung terlebih dahulu.");
            }
        } catch (error) {
            console.error("Error in callback query:", error);
            await bot.sendMessage(chatId, "Terjadi kesalahan. Silakan coba lagi nanti.");
        }
    }
});

// Feature commands
bot.onText(/\/totalusers/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const data = await readUsers();
        await bot.sendMessage(chatId, `Total users: ${data.users.length}`);
    } catch (error) {
        console.error("Error in /totalusers:", error);
        await bot.sendMessage(chatId, "Terjadi kesalahan saat mengambil data users.");
    }
});

bot.onText(/\/broadcast (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const broadcastMessage = match[1];
    
    if (chatId.toString() !== ADMIN_ID) {
        await bot.sendMessage(chatId, 'Maaf, Anda tidak memiliki akses untuk broadcast.');
        return;
    }

    try {
        const data = await readUsers();
        let successCount = 0;
        let failCount = 0;

        for (const userId of data.users) {
            try {
                await bot.sendMessage(userId, broadcastMessage, {
                    parse_mode: 'Markdown'
                });
                successCount++;
                await new Promise(resolve => setTimeout(resolve, 100));
            } catch (error) {
                console.error(`Failed to send message to ${userId}:`, error);
                failCount++;
            }
        }

        await bot.sendMessage(
            chatId,
            `Broadcast selesai!\nBerhasil: ${successCount}\nGagal: ${failCount}`
        );
    } catch (error) {
        console.error("Error in broadcast:", error);
        await bot.sendMessage(chatId, "Terjadi kesalahan saat melakukan broadcast.");
    }
});

bot.onText(/\/pap/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const randomIndex = Math.floor(Math.random() * photoUrls.length);
        await bot.sendPhoto(chatId, photoUrls[randomIndex]);
    } catch (error) {
        console.error("Error sending photo:", error);
        await bot.sendMessage(chatId, "Terjadi kesalahan saat mengirim foto.");
    }
});

bot.onText(/\/sadvibes/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const randomIndex = Math.floor(Math.random() * audioUrls.length);
        await bot.sendAudio(chatId, audioUrls[randomIndex]);
    } catch (error) {
        console.error("Error sending audio:", error);
        await bot.sendMessage(chatId, "Terjadi kesalahan saat mengirim audio.");
    }
});

bot.onText(/\/katakata/, async (msg) => {
    const chatId = msg.chat.id;
    try {
        const randomIndex = Math.floor(Math.random() * kataKata.length);
        await bot.sendMessage(chatId, kataKata[randomIndex]);
    } catch (error) {
        console.error("Error sending kata-kata:", error);
        await bot.sendMessage(chatId, "Terjadi kesalahan saat mengirim kata-kata.");
    }
});

// Sticker creation commands
bot.onText(/^(\.|\#|\/)brat$/, async (msg) => {
    const chatId = msg.chat.id;
    await bot.sendMessage(chatId, `Format salah example /brat katakatabebas`);
});

bot.onText(/\/brat (.+)/, async (msg, match) => {
    const chatId = msg.chat.id;
    const text = match[1];
    const tempFilePath = path.join(__dirname, 'temp_sticker.webp');

    try {
        // Ensure the directory exists
        const dirPath = path.dirname(tempFilePath);
        await fs.mkdir(dirPath, { recursive: true }).catch(() => {});

        // Download and create sticker
        const imageUrl = `https://kepolu-brat.hf.space/brat?q=${encodeURIComponent(text)}`;
        await downloadFile(imageUrl, tempFilePath);
        
        // Send sticker to user
        await bot.sendSticker(chatId, tempFilePath);
    } catch (error) {
        console.error("Error creating sticker:", error);
        await bot.sendMessage(chatId, 'Terjadi kesalahan saat membuat stiker. Silakan coba lagi.');
    } finally {
        // Clean up temporary file
        try {
            const fileExists = await fs.access(tempFilePath).then(() => true).catch(() => false);
            if (fileExists) {
                await fs.unlink(tempFilePath);
            }
        } catch (error) {
            console.error("Error deleting temp file:", error);
        }
    }
});

// Enhanced error handling for the bot
bot.on('error', (error) => {
    console.error('Bot error:', error);
});

bot.on('polling_error', (error) => {
    console.error('Polling error:', error);
});

bot.on('webhook_error', (error) => {
    console.error('Webhook error:', error);
});

// Process-level error handling for unexpected issues
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Log the error but don't exit - let the bot continue running
});

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Log the error but don't exit - let the bot continue running
});

// Graceful shutdown handling
process.on('SIGINT', async () => {
    console.log('Received SIGINT. Performing graceful shutdown...');
    try {
        await bot.stopPolling();
        console.log('Bot polling stopped.');
        process.exit(0);
    } catch (error) {
        console.error('Error during shutdown:', error);
        process.exit(1);
    }
});

// Start message
console.log('Bot is running and ready to handle messages...');
console.log('Press Ctrl+C to stop the bot.');
