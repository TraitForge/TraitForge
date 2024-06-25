import { composeIMG } from '@/utils/imageProcessing';
import s3 from '@/aws-config';
import { ethers } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { contractsConfig } from '@/utils/contractsConfig';

async function startProcessing() {
  const contract = new ethers.Contract(
    contractsConfig.entropyGeneratorContractAddress,
    contractsConfig.entropyGeneratorContractAbi,
    new JsonRpcProvider(contractsConfig.infuraRPCURL)
  );
  let entityGeneration = 2;
  for (let slotIndex = 0; slotIndex < 770; slotIndex++) {
    for (let numberIndex = 0; numberIndex < 13; numberIndex++) {
      try {
        const paddedEntropy = await contract.getPublicEntropy(slotIndex, numberIndex);
        const url = await processImage(paddedEntropy, entityGeneration);
        console.log(`Processed ${paddedEntropy} in generation ${entityGeneration}: ${url}`);
      } catch (error) {
        console.error(`Failed at slot ${slotIndex}, number ${numberIndex} in generation ${entityGeneration}:`, error);
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
  entityGeneration++;
}

export async function processImage(paddedEntropy, entityGeneration) {
  const imageBuffer = await composeIMG(paddedEntropy, entityGeneration);
  if (imageBuffer) {
    const uri = await generateUri(paddedEntropy, entityGeneration);
    const fileName = `${uri}`;
    await uploadToS3(imageBuffer, fileName);

    return `https://traitforge.s3.amazonaws.com/${fileName}`;
  } else {
    throw new Error('Image Layering Failed');
  }
}

async function uploadToS3(imageBuffer, fileName) {
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: fileName,
    Body: imageBuffer,
    ContentType: 'image/jpeg',
  };
  return s3.upload(params).promise();
}

async function generateUri(paddedEntropy, entityGeneration) {
  return `${paddedEntropy}_${entityGeneration}.jpeg`;
}

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { paddedEntropy, entityGeneration } = req.query;

    try {
      const url = await processImage(paddedEntropy, entityGeneration);
      res.setHeader('Content-Type', 'text/plain');
      res.status(200).send(url);
    } catch (error) {
      console.error('Failed to generate or upload:', error);
      res.status(500).send('Failed to compose or upload image');
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

startProcessing();
