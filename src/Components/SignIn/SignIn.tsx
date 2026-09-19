import { Link } from 'react-router'
import MetamaskLogo from "../../assets/MetaMask-icon-fox.svg"
import { useAuth } from '../../Context/AuthContext'

interface Props { }

const SignIn = (props: Props) => {

  const { login, isConnecting, isMetaMaskInstalled, error } = useAuth();

  if (!isMetaMaskInstalled) {
    return (
      <div className="flex justify-center">
        <div className="w-full max-w-3xl space-y-6">
          <div className="auth-card">
            <span className="eyebrow-dot" aria-hidden />
            <h2 className='font-bold text-text'>MetaMask not found</h2>
            <p className="text-sm font-semibold text-secondary">
              This app authenticates by signing a message with your wallet. Install the
              MetaMask browser extension, then reload this page.
            </p>
            <a className="font-semibold text-text text-fg-brand hover:underline" href="https://metamask.io/download/" target="_blank" rel="noreferrer">
              Get MetaMask
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-3xl space-y-6">
        <p className="text-sm leading-6 text-text-secondary">
          Connect your wallet to securely access your account.
        </p>

        <button type="button" onClick={login} disabled={isConnecting}
          className="group flex w-full items-center gap-4 rounded-lg border border-border bg-surface p-3.5 text-left transition-all duration-200 hover:border-secondary hover:bg-surface-elevated hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/20 active:scale-[0.99]"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-border bg-surface-elevated">
            <img src={MetamaskLogo} alt="MetaMask" className="h-8 w-8" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-text">
                MetaMask
              </span>
              <span className="rounded-full bg-surface-elevated px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-text-muted">
                Wallet
              </span>
            </div>

            <p className="mt-0.5 text-sm text-text-secondary">
              Connect using your MetaMask wallet
            </p>
            <p className="mt-0.5 text-xs text-text-secondary">
              or other web3 wallets compatible with MetaMask.
            </p>
          </div>

          <svg
            className="h-4 w-4 shrink-0 text-text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-text"
            viewBox="0 0 20 20"
            fill="none"
            aria-hidden="true"
          >
            <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex gap-3 rounded-lg bg-surface px-3.5 py-3">
          <svg className="mt-0.5 h-4 w-4 shrink-0 text-text-secondary" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M10 2.5L16 5V9.5C16 13.3 13.45 16.55 10 17.5C6.55 16.55 4 13.3 4 9.5V5L10 2.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M7.5 10L9 11.5L12.5 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <p className="text-xs leading-5 text-text-secondary">
            Your wallet stays under your control. We will never ask for
            your private key or recovery phrase.
          </p>
        </div>

        <p className="text-center text-xs leading-5 text-text-muted">
          By connecting your wallet, you agree to the applicable terms
          and acknowledge our <Link to="/Privacy Policy" className='text-text text-fg-brand hover:underline'>privacy policy</Link>.
        </p>

        {error && (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
            <svg className="h-5 w-5 shrink-0 text-red-400" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M10 6V10M10 14H10.01M19 10C19 14.9706 14.9706 19 10 19C5.02944 19 1 14.9706 1 10C1 5.02944 5.02944 1 10 1C14.9706 1 19 5.02944 19 10Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>{error}</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default SignIn