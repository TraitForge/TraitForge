let mintActions = [];

export default async function handler(req, res) {
  try {
    const { event } = req.body;
    const activity = event.activity[0];
    if (activity.fromAddress === '0x25b428dfde728ccfaddad7e29e4ac23c24ed7fd1a6e3e3f91894a9a073f5dfff') {
    // Mints new NFT
     const tokenId = Number(activity.erc721TokenId);
     const price = Number(activity.price);
     const fromAddress = activity.fromAddress;
     const toAddress = activity.toAddress;
     const value = Number(activity.value);

     // Store the details in the array
     mintActions.push({ tokenId, fromAddress, toAddress, value, price });

      // Log the details
      console.log(`Token ID: ${tokenId}`);
      console.log(`From Address: ${fromAddress}`);
      console.log(`To Address: ${toAddress}`);
      console.log(`Value: ${value}`);
      console.log(`Price: ${price}`);

      res.status(200).send('Ok');
    } else {
      res.status(400).send('Invalid values');
    }
  } catch (e) {
    console.log('Nft event error:', e);
    res.status(500).send(e);
  }
}
