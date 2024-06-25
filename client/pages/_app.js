import { DefaultSeo } from 'next-seo';
import SEO from '@/next-seo.config';
import { Wrapper } from '@/components';
import { ContextProvider } from '@/utils/context';
import '../styles/index.css';
import 'swiper/css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-loading-skeleton/dist/skeleton.css';

import Logo from '@/public/images/websitelogo.png';
import '@/styles/main.scss';
import { createWeb3Modal, defaultConfig } from '@web3modal/ethers/react';

import { electroliceFont, bebasFont } from '@/public/fonts';

const projectId = '60db0656302510a26d3e49acc62e5473';

const testnet = {
  chainId: 11155111,
  name: 'Sepolia',
  currency: 'ETH',
  explorerUrl: 'https://etherscan.io',
  rpcUrl: 'https://sepolia.infura.io/v3/bc15b785e15745beaaea0b9c42ae34fa',
};

const metadata = {
  name: 'TraitForge',
  description: 'NFT HoneyPot Game',
  url: 'https://mywebsite.com',
  icons: [Logo],
};

const ethersConfig = defaultConfig({
  metadata,
  enableEIP6963: true,
  enableInjected: true,
  enableCoinbase: true,
  defaultChainId: 11155111,
});

createWeb3Modal({
  ethersConfig,
  chains: [testnet],
  projectId,
  enableAnalytics: true,
});

const App = ({ Component, pageProps }) => (
  <div className={`${electroliceFont.variable} ${bebasFont.variable} font-sans`}>
    <ContextProvider>
      <Wrapper>
        <DefaultSeo {...SEO} />
        <Component {...pageProps} />
        <ToastContainer
          position="bottom-right"
          theme="dark"
          autoClose={3000}
          closeOnClick
          className="custom-toast-container"
          closeButton={false}
          style={{ fontSize: '20px' }}
          limit={3}
        />
      </Wrapper>
    </ContextProvider>
    <div id="modal-root"></div>
  </div>
);

export default App;
