import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { useAuth } from './AuthContext.jsx'
import { getWishlistIds, addToWishlist, removeFromWishlist } from '../api/wishlist.js'

const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [ids, setIds] = useState(new Set())

  const refresh = useCallback(() => {
    if (!isAuthenticated) {
      setIds(new Set())
      return
    }
    getWishlistIds()
      .then((res) => setIds(new Set(res.data)))
      .catch(() => {})
  }, [isAuthenticated])

  useEffect(() => { refresh() }, [refresh])

  async function toggle(contentId) {
    if (ids.has(contentId)) {
      await removeFromWishlist(contentId)
      setIds((prev) => {
        const next = new Set(prev)
        next.delete(contentId)
        return next
      })
    } else {
      await addToWishlist(contentId)
      setIds((prev) => new Set(prev).add(contentId))
    }
  }

  function isWishlisted(contentId) {
    return ids.has(contentId)
  }

  return (
    <WishlistContext.Provider value={{ isWishlisted, toggle, refresh, count: ids.size }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  return useContext(WishlistContext)
}
