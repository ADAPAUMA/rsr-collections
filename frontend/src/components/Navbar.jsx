import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaSignOutAlt } from 'react-icons/fa';

const Navbar = () => {
  const { userInfo, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-dark border-b border-primary border-opacity-20 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-serif text-primary font-bold tracking-wider">
          RSR Collections
        </Link>
        <div className="flex items-center space-x-6">
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <Link to="/contact" className="hover:text-primary transition-colors">Contact</Link>
          
          <Link to="/cart" className="relative hover:text-primary transition-colors">
            <FaShoppingCart size={20} />
            {cartItems.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-dark-dark text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                {cartItems.reduce((acc, item) => acc + item.qty, 0)}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="relative group cursor-pointer inline-flex items-center space-x-2">
              <span className="text-sm font-medium hover:text-primary flex items-center gap-1">
                <FaUser /> {userInfo.name}
              </span>
              <div className="absolute right-0 top-full mt-2 w-48 bg-dark border border-gray-700 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                {userInfo.isAdmin && (
                  <>
                    <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-dark-light hover:text-primary">Dashboard</Link>
                    <Link to="/admin/products" className="block px-4 py-2 hover:bg-dark-light hover:text-primary">Products</Link>
                    <Link to="/admin/orders" className="block px-4 py-2 hover:bg-dark-light hover:text-primary">Orders</Link>
                  </>
                )}
                <Link to="/orders" className="block px-4 py-2 hover:bg-dark-light hover:text-primary">My Orders</Link>
                <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-dark-light text-red-400 flex items-center gap-2">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="btn-primary flex items-center gap-2">
              <FaUser size={14} /> Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
