import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types/CartItem';
import styles from './CartPage.module.css';

function CartPage() {
  const navigate = useNavigate();
  const { cart, removeFromCart } = useCart();
  //Calculate Total for the entire order in the cart
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // return each Book in the cart along with it's price, how many the user wants to order, and what they subtotal is
  // remove button takes a quantity of one book away from the selected book
  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Your cart</h2>
      <div>
        {cart.length === 0 ? (
          <p className={styles.emptyCartMessage}>Your cart is empty.</p>
        ) : (
          <ul className={styles.cartList}>
            {cart.map((item: CartItem) => (
              <li key={item.bookID} className={styles.cartItem}>
                <strong>{item.title}</strong> by {item.author} <br />
                Price: ${item.price.toFixed(2)} <br />
                Quantity: {item.quantity} <br />
                Subtotal: ${(item.price * item.quantity).toFixed(2)} <br />
                <button
                  className={styles.removeButton}
                  onClick={() => removeFromCart(item.bookID)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <h3 className={styles.totalAmount}>Total: ${totalAmount.toFixed(2)}</h3>
      <div>
        <button className={styles.checkoutButton}>
          {' '}
          {/*Extra bootstrap used: inserted the bootstrap circle check icon onto the Checkout button*/}
          <i className="bi bi-check-circle"></i> Checkout
        </button>
        <button
          className={styles.continueButton}
          onClick={() => navigate('/books')}
        >
          Continue Browsing
        </button>
      </div>
    </div>
  );
}
export default CartPage;
