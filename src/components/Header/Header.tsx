import styles from './Header.module.scss'
import clsx from 'clsx'
import {
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type { SectionId } from '../../shared/sections'

interface Section {
  id: SectionId
  name: string
}

interface HeaderProps {
  sections: readonly Section[]
  currentSection: SectionId
  className?: string
}

const Header = ({
                  sections,
                  currentSection,
                  className,
                }: HeaderProps) => {
  const itemsRef = useRef<Record<SectionId, HTMLLIElement | null>>(
    {} as Record<SectionId, HTMLLIElement | null>
  )

  const [ready, setReady] = useState(false)

  // 🔑 гарантируем, что refs уже есть
  useLayoutEffect(() => {
    setReady(true)
  }, [])

  const indicatorStyle = useMemo(() => {
    if (!ready) return {}

    const el = itemsRef.current[currentSection]
    if (!el) return {}

    return {
      left: el.offsetLeft,
      width: el.offsetWidth,
    }
  }, [currentSection, ready])

  return (
    <header className={clsx(className, styles.header)}>
      <div className={styles.headerInner}>
        <a href="/" className={styles.headerLogo}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            className="lucide lucide-code-xml-icon lucide-code-xml"
          >
            <path d="m18 16 4-4-4-4" />
            <path d="m6 8-4 4 4 4" />
            <path d="m14.5 4-5 16" />
          </svg>
        </a>

        <nav className={styles.headerNav}>
          <ul className={styles.headerNavList}>
            {sections.map(({id, name}) => (
              <li
                key={id}
                ref={el => {
                  itemsRef.current[id] = el
                }}
                className={clsx(
                  styles.headerNavItem,
                  currentSection === id && styles.headerNavItemActive
                )}
              >
                <a
                  className={styles.headerNavLink}
                  href={`#${id}`}
                >
                  {name}
                </a>
              </li>
            ))}
          </ul>

          <div
            className={styles.headerNavIndicator}
            style={indicatorStyle}
          />
        </nav>
      </div>
    </header>
  )
}

export default Header
