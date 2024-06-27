import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { event } = req.body;
    const activity = event.activity[0];

    if (activity.topics === '0x19f5f791ee407773427bf7b970bbbc3375065c32edd1ab142e23a84f94b0719b') {
      const tokenId = Number(activity.erc721TokenId);
      const price = activity.price;
      const toAddress = activity.toAddress;
      const shortenedAddress = `${toAddress.substring(0, 5)}...${toAddress.substring(toAddress.length - 5)}`;
      const message = JSON.stringify(`Entity Minted! ${shortenedAddress} minted token ID ${tokenId} for ${price}`);
      const response = await axios.post('http://localhost:3000/api/telegram-bot', {
        message
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

