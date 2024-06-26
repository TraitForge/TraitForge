import axios from 'axios';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const testEvent = {
      event: {
        activity: [{
          topics: '0x8c9149f14ad96a26724a68fd0cc1d0ed43cdbf7e29d39c7857ca4c1d5b5a864d',
          erc721TokenId: '121',
          price: '1.2ETH',
          fromAddress: '0xSenderAddress',
          toAddress: '0x225b791581185B73Eb52156942369843E8B0Eec7',
          value: '2'
        }]
      }
    };

    try {
      const response = await axios.post('http://localhost:3000/api/nuke-event', testEvent);
      console.log('Response:', response.data);
      res.status(200).json({ message: 'Test event sent successfully', response: response.data });
    } catch (error) {
      console.error('Error testing handler:', error.response ? error.response.data : error.message);
      res.status(500).json({ message: 'Error testing handler', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
