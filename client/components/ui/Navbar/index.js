import Link from 'next/link';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import { useEffect, useState } from 'react';

import { Logo } from '@/icons';
import ConnectButton from '@/components/ui/WalletButton';
import { icons } from '@/icons/icons';

const links = [
  { url: '/', text: 'HOME' },
  { url: '/forging', text: 'FORGING' },
  { url: '/trading', text: 'MARKETPLACE' },
  { url: '/nuke-fund', text: 'NUKEFUND' },
  { url: '/stats', text: 'GAME STATS' },
];

const Navbar = () => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [router.asPath]);

  const commonClasses = `text-base font-bebas flex items-center py-6 lg:text-[32px] lg:text-[32px] relative after:absolute after:bottom-0 after:left-0 after:w-full hover:after:h-[2px] after:h-[0px]`;
  const navLinkClasses = classNames(commonClasses, {
    'after:bg-neon-orange hover:text-neon-orange': router.asPath === '/forging',
    'after:bg-neon-green hover:text-neon-green': router.asPath === '/trading',
    'after:bg-neon-purple hover:text-neon-purple': router.asPath === '/nuke-fund',
    'after:bg-neon-green-yellow hover:text-neon-green-yellow': router.asPath === '/stats',
    'after:bg-primary hover:text-primary': router.asPath === '/',
  });

  const activeClass = classNames({
    'text-neon-orange': router.asPath === '/forging',
    'text-neon-green': router.asPath === '/trading',
    'text-neon-purple': router.asPath === '/nuke-fund',
    'text-neon-green-yellow': router.asPath === '/stats',
    'text-primary': router.asPath === '/',
  });

  const expandedClasses = classNames('container max-lg:py-1 flex items-center justify-between');

  return (
    <header>
      <nav className={expandedClasses}>
        <Link href="/" className="inline-block">
          <Logo />
        </Link>
        <ul className="flex gap-x-[20px] xl:gap-x-[64px] max-lg:hidden">
          {links.map((link, index) => (
            <li key={index}>
              <Link className={`${navLinkClasses} ${link.url === router.asPath && activeClass}`} href={link.url}>
                {link.text}
              </Link>
            </li>
          ))}
        </ul>
        <div className="walletbackground flex justify-center p-1 rounded-lg gap-x-6">
          <ConnectButton />
          <button className="block lg:hidden" onClick={() => setIsMenuOpen(prevState => !prevState)}>
            {icons.menu()}
          </button>
        </div>
        {isMenuOpen && (
          <ul className="absolute top-[56px] right-0 w-[70%] bg-black h-[calc(100vh-56px)] z-50 px-[46px] py-10">
            {links.map((link, index) => (
              <li key={index}>
                <Link
                  className={`${navLinkClasses} !text-[32px] ${link.url === router.asPath && activeClass}`}
                  href={link.url}
                >
                  {link.text}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
