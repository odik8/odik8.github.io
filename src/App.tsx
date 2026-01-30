import './assets/styles'
import Header from "./components/Header";
import {useState} from "react";

function App() {

  const [currentSection, setCurrentSection] = useState('')
  
  return (
    <>
      <Header/>
      <hr/>
      <section id="about" style={{
        height: '100vh',
        background: 'var(--bg)'
      }}></section>
      <hr/>
      <section id="skills" style={{
        height: '100vh',
        background: 'var(--bg-light)'
      }}></section>
      <hr/>
      <section id="portfolio" style={{
        height: '100vh',
        background: 'var(--bg)'
      }}></section>
      <hr/>
      <section id="workExperience" style={{
        height: '100vh',
        background: 'var(--bg-light)'
      }}></section>
      <hr/>
      <section id="contacts" style={{
        height: '100vh',
        background: 'var(--bg)'
      }}></section>
      <hr/>
    </>
  )
}

export default App
