import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { getCart, addToCart, removeFromCart } from '../api/cart.js'

const CartContext = createContext(null)
const EMPTY_CART = { items: [], itemCount: 0, totalAmount: 0 }

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cart, setCart] = useState(EMPTY_CART)

  const refresh = useCallback(() => {
    if (!isAuthenticated) {
      setCart(EMPTY_CART)
      return
    }
    getCart()
      .then((res) => setCart(res.data))
      .catch(() => {})
  }, [isAuthenticated])

  useEffect(() => { refresh() }, [refresh])

  async function add(contentId) {
    const res = await addToCart(contentId)
    setCart(res.data)
  }

  async function remove(contentId) {
    const res = await removeFromCart(contentId)
    setCart(res.data)
  }

  function isInCart(contentId) {
    return cart.items.some((item) => item.contentId === contentId)
  }

  return (
    <CartContext.Provider value={{ cart, add, remove, refresh, isInCart, count: cart.itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  return useContext(CartContext)
}
