import axios from 'axios';

let nukeActions = [];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { event } = req.body;
    const activity = event.activity[0];

    if (activity.topics === '0x8c9149f14ad96a26724a68fd0cc1d0ed43cdbf7e29d39c7857ca4c1d5b5a864d') {
      // Mints new NFT
      const tokenId = Number(activity.erc721TokenId);
      const price = Number(activity.price);
      const fromAddress = activity.fromAddress;
      const toAddress = activity.toAddress;
      const value = Number(activity.value);

      // Store the details in the array
      nukeActions.push({ tokenId, fromAddress, toAddress, value, price });

      // Log the details
      console.log(`Token ID: ${tokenId}`);
      console.log(`From Address: ${fromAddress}`);
      console.log(`To Address: ${toAddress}`);
      console.log(`Value: ${value}`);
      console.log(`Price: ${price}`);

      // Send the NFT data to the Telegram bot
      const response = await axios.post('http://localhost:3000/api/telegram-bot', {
        tokenId,
        fromAddress,
        toAddress,
        value,
        price
      });

      console.log('NFT data sent to Telegram bot:', response.data);
      res.status(200).send('Ok');
    } else {
      res.status(400).send('Invalid values');
    }
  } catch (e) {
    console.log('NFT event error:', e);
    res.status(500).send(e.message);
  }
}
