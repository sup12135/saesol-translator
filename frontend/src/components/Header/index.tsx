// src/components/Header/index.tsx
import HeaderTitle from './HeaderTitle';
import Navigation from './Navigation';
import HeaderButtons from './HeaderButton'
const Header = () => {
  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 1000,
        backgroundColor: '#ADDFF1',
        height: '80.67px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 20px',
        boxSizing: 'border-box',
      }}
    >
      <HeaderTitle />
      <Navigation />
      <HeaderButtons />
    </header>
  );
};

export default Header;