import { faTwitter, faDiscord, faTelegram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import styles from './styles.module.scss';

const links = [
  {
    url: 'https://t.me/+b31jKqlV-1BjNzY1',
    icon: faTelegram,
    text: 'Telegram',
  },
  { url: 'https://twitter.com/TraitForge', icon: faTwitter, text: 'Twitter' },
  { url: 'https://discord.gg/KWHCEY6zFT', icon: faDiscord, text: 'Discord' },
];

const Footer = () => {
  return (
    <footer className={styles.container}>
      <div className={styles.footer}>
        {links.map(({ url, icon }, index) => (
          <a href={url} key={index} target="_blank" rel="noopener noreferrer" className={styles.smIcons}>
            <FontAwesomeIcon icon={icon} size="1x" />
          </a>
        ))}
      </div>
    </footer>
  );
};

export default Footer;
