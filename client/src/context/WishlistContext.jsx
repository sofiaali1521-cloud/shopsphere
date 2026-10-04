import { createContext, useContext, useEffect, useState } from 'react';
import api, { getErrorMessage } from '../api/client.js';
import { useAuth } from './AuthContext.jsx';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      setWishlist([]);
      return;
    }
    setLoading(true);
    api
      .get('/wishlist')
      .then(({ data }) => setWishlist(data))
      .catch((err) => setError(getErrorMessage(err)))
      .finally(() => setLoading(false));
  }, [user]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item) === productId);
  };

  const addToWishlist = async (productId) => {
    try {
      const { data } = await api.post(`/wishlist/${productId}`);
      setWishlist(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await api.delete(`/wishlist/${productId}`);
      setWishlist(data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const toggleWishlist = async (product) => {
    const id = product._id || product;
    if (isInWishlist(id)) {
      await removeFromWishlist(id);
    } else {
      await addToWishlist(id);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        error,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => useContext(WishlistContext);
