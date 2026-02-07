import './assets/styles'
import { useEffect, useState } from 'react'
import Header from './components/Header'
import { SECTIONS } from './shared/sections'
import type { SectionId } from "./shared/sections";

function App() {
  const [currentSection, setCurrentSection] = useState<SectionId>('about')

  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('section[id]')

    const observer = new IntersectionObserver(
      entries => {
        const visibleEntry = entries
          .find(entry => entry.isIntersecting)

        if (visibleEntry) {
          setCurrentSection(visibleEntry.target.id as SectionId)
        }
      },
      {
        threshold: 0.5,
      }
    )

    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <Header
        sections={SECTIONS}
        currentSection={currentSection}
      />
      <div style={{
        height: '91px'
      }}></div>

      {SECTIONS.map(({id, name}) => (
        <section
          key={id}
          id={id}
          style={{
            height: '90vh',
            background: 'var(--bg)',
            marginBottom: '1rem',
          }}
        >
          {name}
        </section>
      ))}
    </>
  )
}

export default App
