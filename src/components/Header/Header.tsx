import styles from './Header.module.scss'
import clsx from 'clsx'
import {useEffect, useRef, useState} from "react";

const Header = (props: any) => {
  const {className} = props

  const [activeIndex, setActiveIndex] = useState(0)
  const [indicatorStyles, setIndicatorStyles] = useState({})
  const navItemsRef = useRef([])

  useEffect(() => {
    const item = navItemsRef.current[activeIndex]
    if (item) {
      setIndicatorStyles({
        left: `${item.offsetLeft}px`,
        width: `${item.offsetWidth}px`
      })
    }
  }, [activeIndex]);

  interface NavItem {
    label: string;
    href: string;
  }

  const navItems: NavItem[] = [
    {
      label: 'About',
      href: '#about',
    },
    {
      label: 'Skills',
      href: '#skills'
    },
    {
      label: 'Portfolio',
      href: '#portfolio'
    },
    {
      label: 'Work Experience',
      href: '#workExperience'
    },
    {
      label: 'Contacts',
      href: '#contacts'
    },
  ]

  return (
    <header className={clsx(className, styles.header)}>
      <div className={styles.headerInner}>
        <a className={styles.headerLogo}>
          <img
            className={styles.headerLogoImage}
            src=""
            alt=""
            width="100"
            height="35"
            loading="eager"
          />
        </a>
        <nav className={styles.headerNav}>
          <ul className={styles.headerNavList}>
            {navItems.map(({label, href}, idx) => (
              <li
                ref={element => {
                  navItemsRef.current[idx] = element
                }}
                className={clsx(styles.headerNavItem, activeIndex === idx && styles.headerNavItemActive)}
                key={href}
                onClick={() => setActiveIndex(idx)}
              >
                <a
                  className={styles.headerNavLink}
                  href={href}
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.headerNavIndicator} style={indicatorStyles}></div>
        </nav>
      </div>
    </header>
  )
}

export default Header
