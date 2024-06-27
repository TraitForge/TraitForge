import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const { event } = req.body;
    const activity = event.activity[0];

    if (activity.topics === '0x5fafad85dec201c2e73b6a2bef6351129304a624ea8720ecd04cd7f04d83bc39') {
      const tokenId = Number(activity.erc721TokenId);
      const price = activity.price;
      const seller = activity.fromAddress;
      const buyer = activity.toAddress;
      const buyerAddress = `${buyer.substring(0, 5)}...${buyer.substring(buyer.length - 5)}`;
      const sellerAddress = `${seller.substring(0, 5)}...${seller.substring(seller.length - 5)}`;
      const message = `Entity Bought! ${buyerAddress} bought token ID ${tokenId} from ${sellerAddress} for ${price}`;
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