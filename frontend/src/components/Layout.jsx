import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Toast from './Toast';
import { useCustomCursor } from '../hooks/useCustomCursor';
import { useShop } from '../context/ShopContext';

export default function Layout() {
  const { cursorPos, cursorRingPos, hovered, handleHoverIn, handleHoverOut } = useCustomCursor();
  const { toast } = useShop();

  return (
    <>
      <div className={`cursor${hovered ? ' hovered' : ''}`} style={{ left: cursorPos.x, top: cursorPos.y }} />
      <div className={`cursor-ring${hovered ? ' hovered' : ''}`} style={{ left: cursorRingPos.x, top: cursorRingPos.y }} />
      <Navbar onHoverIn={handleHoverIn} onHoverOut={handleHoverOut} />
      <main>
        <Outlet context={{ handleHoverIn, handleHoverOut }} />
      </main>
      <Footer onHoverIn={handleHoverIn} onHoverOut={handleHoverOut} />
      <Toast open={toast.open} message={toast.message} type={toast.type} />
    </>
  );
}