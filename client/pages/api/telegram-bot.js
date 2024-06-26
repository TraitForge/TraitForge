import { Telegraf } from 'telegraf';

const { BOT_TOKEN } = process.env;

const bot = new Telegraf(BOT_TOKEN);

bot.start((ctx) => ctx.reply('Welcome! I can track Ethereum events.'));

bot.on('text', async (ctx) => {
  try {
    const data = JSON.parse(ctx.message.text); 
    const { tokenId, fromAddress, toAddress, value, price } = data;
    await ctx.reply(`New NFT minted:\n
        Token ID: ${tokenId}\n
        From: ${fromAddress}\n
        To: ${toAddress}\n
        Value: ${value}\n
        Price: ${price}`);
  } catch (error) {
    console.error('Error processing NFT data:', error);
    ctx.reply('An error occurred while processing NFT data.');
  }
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    try {
      const { tokenId, toAddress, price } = req.body;

      const messageText = JSON.stringify(
        `New NFT minted: ${toAddress} minted token ID: ${tokenId} for ${price}`
      );

      await bot.telegram.sendMessage(process.env.BOT_CHAT_ID, messageText);

      res.status(200).send('Success');
    } catch (error) {
      console.error('Error handling POST request:', error);
      res.status(500).send('Error processing request');
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
};

