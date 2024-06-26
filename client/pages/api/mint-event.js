
export default async function handler(req, res) {
  try {
    const { event } = req.body;
    const activity = event.activity[0];

    if (activity.fromAddress === '0x0000000000000000000000000000000000000000') {
      // Mints new NFT
      const tokenId = Number(activity.erc721TokenId);
      const price = Number(activity.price);
      const fromAddress = activity.fromAddress;
      const toAddress = activity.toAddress;
      const value = Number(activity.value);

      // Log the details
      console.log(`Token ID: ${tokenId}`);
      console.log(`From Address: ${fromAddress}`);
      console.log(`To Address: ${toAddress}`);
      console.log(`Value: ${value}`);
      console.log(`Price: ${price}`);

      res.status(200).send('Ok');
    } else {
      res.status(400).send('Invalid fromAddress');
    }
  } catch (e) {
    console.log('Nft event error:', e);
    res.status(500).send(e);
  }
}
