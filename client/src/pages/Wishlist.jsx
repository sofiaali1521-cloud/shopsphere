import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import Loader from '../components/Loader.jsx';
import { formatINR } from '../utils/format.js';

export default function Wishlist() {
  const { wishlist, loading, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleMoveToCart = (product) => {
    addToCart(product);
    removeFromWishlist(product._id);
  };

  if (loading) return <Loader />;

  if (wishlist.length === 0) {
    return (
      <section className="empty">
        <h2>Your wishlist is empty</h2>
        <p className="muted">Save items you love to your wishlist and revisit them anytime.</p>
        <Link to="/" className="btn" style={{ marginTop: '16px' }}>Explore products</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>My Wishlist ({wishlist.length})</h1>
      <div className="cart-list">
        {wishlist.map((product) => {
          const outOfStock = product.stock === 0;
          return (
            <div key={product._id} className="cart-item card">
              <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <div className="grow">
                <Link to={`/product/${product._id}`} className="product-name">
                  <strong>{product.name}</strong>
                </Link>
                <p className="muted">
                  {formatINR(product.price)} · {product.category}
                </p>
                <span className={outOfStock ? 'error' : 'success'}>
                  {outOfStock ? 'Out of stock' : `${product.stock} in stock`}
                </span>
              </div>
              <div className="row">
                <button
                  className="btn"
                  disabled={outOfStock}
                  onClick={() => handleMoveToCart(product)}
                >
                  {outOfStock ? 'Out of stock' : 'Move to cart'}
                </button>
                <button
                  className="btn btn-ghost"
                  onClick={() => removeFromWishlist(product._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
