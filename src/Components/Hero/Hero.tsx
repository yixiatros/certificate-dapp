import React, { useState, type JSX, type SyntheticEvent } from 'react'
import heroImg from '../../assets/hero.png'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

interface Props {
    onClick: (e: SyntheticEvent) => void,
    count: number
}

const Hero: React.FC<Props> = ({ onClick, count }: Props): JSX.Element => {
  return (
    <section id="hero">
      <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>Get started</h1>
          <p>
            Edit <code>src/App.tsx</code> and save to test <code>HMR</code>
          </p>
        </div>
        <button type="button" className="counter" onClick={(e) => onClick(e)} >
          Count is {count}
        </button>
    </section>
  )
}

export default Hero