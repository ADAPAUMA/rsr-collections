import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userInfo } = useContext(AuthContext);
  
  // Create a unique key for the user, or use 'guest' if not logged in
  const cartKey = userInfo ? `cartItems_${userInfo._id}` : 'cartItems_guest';

  const [cartItems, setCartItems] = useState([]);

  // Load cart items when the user/cartKey changes
  useEffect(() => {
    const saved = localStorage.getItem(cartKey);
    if (saved) {
      setCartItems(JSON.parse(saved));
    } else {
      setCartItems([]);
    }
  }, [cartKey]);

  // Save cart items whenever they change
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  const [selectedItems, setSelectedItems] = useState([]);

  // Clear selected items if they are removed from the cart entirely
  useEffect(() => {
    setSelectedItems(prev => prev.filter(id => cartItems.some(item => item._id === id)));
  }, [cartItems]);

  const addToCart = (product, qty) => {
    const existItem = cartItems.find((x) => x._id === product._id);
    if (existItem) {
        setCartItems(cartItems.map((x) =>
            x._id === existItem._id ? { ...product, qty } : x
        ));
    } else {
        setCartItems([...cartItems, { ...product, qty }]);
        // Auto-select newly added items
        setSelectedItems(prev => [...new Set([...prev, product._id])]);
    }
  };

  const removeFromCart = (id) => {
    setCartItems(cartItems.filter((x) => x._id !== id));
    // The useEffect will handle removing from selectedItems
  };

  const clearCart = () => {
    setCartItems([]);
    setSelectedItems([]);
    localStorage.removeItem(cartKey);
  };

  const toggleItemSelection = (id) => {
    setSelectedItems(prev => 
      prev.includes(id) ? prev.filter(itemId => itemId !== id) : [...prev, id]
    );
  };

  const setAllSelected = (isSelected) => {
    if (isSelected) {
      setSelectedItems(cartItems.map(item => item._id));
    } else {
      setSelectedItems([]);
    }
  };

  const clearSelection = () => setSelectedItems([]);

  return (
    <CartContext.Provider value={{ 
        cartItems, 
        selectedItems,
        addToCart, 
        removeFromCart, 
        clearCart,
        toggleItemSelection,
        setAllSelected,
        clearSelection
    }}>
      {children}
    </CartContext.Provider>
  );
};
