import logo from '../../assets/react.svg'
import { Link } from 'react-router'
import SignIn from '../SignIn/SignIn'
import { useState } from 'react';
import Modal from '../Modal/Modal';
import { useAuth } from '../../Context/AuthContext';
import { USER_ROLE_LABELS, UserRole } from '../../Types/Auth';

interface Props { }

const Navbar = (_props: Props) => {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const { isAuthenticated, address, profile, logout } = useAuth();

  const onClickSignIn = () => {
    setModalOpen(true);
  };

  const shortAddress = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : '';
  const roleLabel = profile ? USER_ROLE_LABELS[profile.role] : 'Connecting...';

  return (
    <nav className="relative container mx-auto p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-20">
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
          <div className="hidden font-bold lg:flex">
            <Link to="/" className="text-white hover:text-darkBlue">
              HomePage
            </Link>
          </div>
          <div className="hidden font-bold lg:flex">
            {profile?.role === UserRole['Admin'] && (
              <Link to="/Admin Dashboard" className="text-white hover:text-darkBlue">
                Dashboard
              </Link>
            )}
          </div>
        </div>
        <div className="hidden lg:flex items-center space-x-6 text-back">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-lightBlue/20 px-3 py-1 text-xs font-semibold text-lightBlue border border-lightBlue/40">
                {roleLabel} {profile?.name ? `(${profile.name})` : ''}
              </span>
              <span className="font-mono text-sm">{shortAddress}</span>
              <button type="button" onClick={logout} className="text-text-secondary cursor-pointer hover:text-darkBlue">
                Log out
              </button>
            </div>
          ) : (
            <>
              <Link to="/SignIn" className="cursor-pointer hover:text-darkBlue">
                SignIn
              </Link>
              <button type="button" onClick={onClickSignIn} className="px-8 py-3 font-bold rounded text-white bg-lightBlue hover:opacity-70">
                Login
              </button>
            </>
          )}
        </div>
      </div>

      {!isAuthenticated && (
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="SignIn" closeOnBackdropClick>
          <SignIn />
        </Modal>
      )}
    </nav>
  )
}

export default Navbar