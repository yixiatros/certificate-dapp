import React, { type JSX, type SyntheticEvent } from 'react'
import heroImg from '../../assets/hero.png'
import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'
import { useAuth } from '../../Context/AuthContext'
import { USER_ROLE_LABELS } from '../../Types/Auth'

interface Props {
  onClick: (e: SyntheticEvent) => void,
  count: number
}

const Hero: React.FC<Props> = ({ onClick, count }: Props): JSX.Element => {
  const { isAuthenticated, address, profile } = useAuth();

  return (
    <section id="hero">
      <div className="hero">
        <img src={heroImg} className="base" width="170" height="179" alt="" />
        <img src={reactLogo} className="framework" alt="React logo" />
        <img src={viteLogo} className="vite" alt="Vite logo" />
      </div>
      <div>
        {isAuthenticated ? (
          <div className="p-4 rounded-xl bg-surface-elevated border border-border shadow-md my-4 max-w-xl mx-auto text-left">
            <h2 className="text-xl font-bold text-lightBlue mb-2">Welcome Back!</h2>
            <p className="text-sm text-text-secondary mb-1">
              <strong>Wallet Address:</strong> <code className="text-xs bg-slate-800 p-1 rounded">{address}</code>
            </p>
            <p className="text-sm text-text-secondary mb-1">
              <strong>Assigned Role:</strong> <span className="text-amber-400 font-semibold">{profile ? USER_ROLE_LABELS[profile.role] : 'Loading...'}</span>
            </p>
            {profile?.name && (
              <p className="text-sm text-text-secondary mb-1">
                <strong>Registered Name:</strong> {profile.name}
              </p>
            )}
            {profile?.isAdmin && (
              <p className="text-xs text-emerald-400 font-bold mt-2">
                ★ Smart Contract Administrator Access Granted
              </p>
            )}
          </div>
        ) : (
          <>
            <h1>Get started</h1>
            <p>Connect your MetaMask wallet to view your contract role & permissions.</p>
          </>
        )}
      </div>
      <button type="button" className="counter" onClick={(e) => onClick(e)} >
        Count is {count}
      </button>
    </section>
  )
}

export default Hero