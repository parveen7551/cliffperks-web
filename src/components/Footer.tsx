import Logo from '@/components/Logo';
import styles from './Footer.module.css';

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: 'Explore',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Jobs', href: '/jobs' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Contact', href: '/contact' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Privacy', href: '/privacy' },
      { label: 'Terms', href: '/terms' },
    ],
  },
  {
    title: 'Follow',
    links: [{ label: 'LinkedIn', href: '#' }],
  },
  {
    title: 'Corporate',
    links: [
      { label: 'Get Perks — Canada', href: '/employer' },
      { label: 'Become a Perk Provider — Canada', href: '/providers' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Logo height={32} />
          <span className={styles.brandName}>
            <span style={{ color: '#1E2B4A' }}>Cliff</span>
            <span style={{ color: '#F5941D' }}>Perks</span>
          </span>
        </div>

        <div className={styles.columns}>
          {columns.map((column) => (
            <div className={styles.column} key={column.title}>
              <h2>{column.title}</h2>
              <ul>
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
