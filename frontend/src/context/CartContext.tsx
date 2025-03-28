import { ReactNode, createContext, useContext, useState } from 'react';
import { CartItem } from '../types/CartItem';

//Template for the methods contained on this page
interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (bookID: number) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  //Adds Item to Cart. If the item is already in the cart, it updates the quantity.
  const addToCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((c) => c.bookID === item.bookID);

      if (existingItem) {
        // If the book is already in the cart, increase its quantity
        return prevCart.map((c) =>
          c.bookID === item.bookID ? { ...c, quantity: c.quantity + 1 } : c
        );
      } else {
        // Otherwise, add the book to the cart with quantity 1
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };

  //Removes Item from Cart
  const removeFromCart = (bookID: number) => {
    setCart(
      (prevCart) =>
        prevCart
          .map((item) =>
            item.bookID === bookID
              ? { ...item, quantity: item.quantity - 1 } // Decrease quantity
              : item
          )
          .filter((item) => item.quantity > 0) // Remove if quantity is 0
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
