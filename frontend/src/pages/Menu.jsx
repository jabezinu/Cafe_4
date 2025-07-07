import React, { useEffect, useState } from 'react'
import axios from 'axios'
import StarRating from '../component/StarRating'
import useMenuStore from '../store/menuStore'

const getAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + (r.stars || 0), 0);
  return (sum / ratings.length).toFixed(1);
}


const Menu = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [error, setError] = useState(null)
  const [ratingSubmitting, setRatingSubmitting] = useState(false)
  const [userRatings, setUserRatings] = useState({})
  const [pendingRatings, setPendingRatings] = useState({})

  // Zustand store
  const { menusByCategory, loading, error: menuError, fetchMenus, clearError } = useMenuStore()

  useEffect(() => {
    axios.get(`${API_URL}/categories`)
      .then(res => {
        setCategories(res.data)
        if (res.data.length > 0) setSelectedCategory(res.data[0].id)
      })
      .catch(() => {
        setError('Failed to fetch categories')
      })
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      fetchMenus(selectedCategory, API_URL)
    }
  }, [selectedCategory, API_URL, fetchMenus])

  const handleCategoryClick = (id) => {
    setSelectedCategory(id)
    clearError()
  }

  const handleStarClick = (menuId, stars) => {
    setPendingRatings(prev => ({ ...prev, [menuId]: stars }))
  }

  const handleSubmitRating = (menuId) => {
    const stars = pendingRatings[menuId]
    if (!stars) return
    setRatingSubmitting(true)
    axios.post(`${API_URL}/menus/${menuId}/ratings`, { rating: { stars } })
      .then(() => {
        setUserRatings(prev => ({ ...prev, [menuId]: stars }))
        setPendingRatings(prev => ({ ...prev, [menuId]: 0 }))
        // Refetch and update cache for this category
        fetchMenus(selectedCategory, API_URL)
        setRatingSubmitting(false)
      })
      .catch(() => {
        setError('Failed to submit rating')
        setRatingSubmitting(false)
      })
  }

  if (loading) return <div>Loading...</div>
  if (error || menuError) return <div className="text-red-500">{error || menuError}</div>

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Categories</h2>
      <ul className="flex space-x-2 mb-6">
        {categories.map(cat => (
          <li key={cat.id}>
            <button
              className={`px-4 py-2 rounded ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
      <h3 className="text-xl font-semibold mb-2">Menu Items</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(menusByCategory[selectedCategory]?.menus?.length === 0) && <div className="col-span-2 text-gray-500">No menu items found for this category.</div>}
        {(menusByCategory[selectedCategory]?.menus || []).map(menu => (
          <div key={menu.id} className="border rounded-lg p-4 bg-white shadow flex flex-col items-center">
            {menu.image && <img src={menu.image} alt={menu.name} className="w-32 h-32 object-cover rounded mb-2" />}
            <div className="font-bold text-lg mb-1">{menu.name}</div>
            <div className="text-gray-700 mb-1">${menu.price}</div>
            {menu.badge && <span className="inline-block bg-green-200 text-green-800 px-2 py-1 rounded text-xs mb-1">{menu.badge}</span>}
            <div className="mb-2">
              <span className="text-yellow-500 font-semibold">Avg Rating: {getAverageRating(menu.ratings)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <StarRating
                rating={pendingRatings[menu.id] || userRatings[menu.id] || 0}
                onRate={(stars) => handleStarClick(menu.id, stars)}
                disabled={ratingSubmitting}
              />
              <button
                className="ml-2 px-3 py-1 bg-blue-500 text-white rounded disabled:opacity-50"
                onClick={() => handleSubmitRating(menu.id)}
                disabled={ratingSubmitting || !(pendingRatings[menu.id] > 0)}
              >
                Submit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu
