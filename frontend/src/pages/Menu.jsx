import React, { useEffect, useState } from 'react'
import axios from 'axios'
import {ChefHat, Utensils, Loader2, AlertCircle} from 'lucide-react';
import StarRating from '../component/StarRating'
import useMenuStore from '../store/menuStore'
import Footer from '../component/Footer';

const getAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) return 0;
  const sum = ratings.reduce((acc, r) => acc + (r.stars || 0), 0);
  return (sum / ratings.length).toFixed(1);
}

// Helper to get today's date string
const getToday = () => new Date().toISOString().slice(0, 10);

// Helper to get rating activity from localStorage
const getRatingActivity = () => {
  try {
    return JSON.parse(localStorage.getItem('ratingActivity') || '{}');
  } catch {
    return {};
  }
};

// Helper to set rating activity in localStorage
const setRatingActivity = (activity) => {
  localStorage.setItem('ratingActivity', JSON.stringify(activity));
};

const Menu = () => {
  const API_URL = import.meta.env.VITE_API_URL;

  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [ratingSubmitting, setRatingSubmitting] = useState(false)
  const [userRatings, setUserRatings] = useState({})
  const [pendingRatings, setPendingRatings] = useState({})
  const [confirmation, setConfirmation] = useState(null)
  const [error, setError] = useState(null)

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

  useEffect(() => {
    // Check and clean up old rating activity
    const checkRatingActivity = () => {
      const activity = getRatingActivity();
      const today = getToday();
      const now = new Date();
      
      // Remove entries older than 24 hours
      Object.keys(activity).forEach(date => {
        if (date !== today) {
          const activityDate = new Date(date);
          const timeDiff = now - activityDate;
          if (timeDiff > 24 * 60 * 60 * 1000) {
            delete activity[date];
          }
        }
      });
      setRatingActivity(activity);
    };

    checkRatingActivity();
    // Run cleanup periodically
    const interval = setInterval(checkRatingActivity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, []);

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
    const today = getToday();
    const activity = getRatingActivity();
    const todayActivity = activity[today] || [];

    // Restrict: not more than one rating per menu per day
    if (todayActivity.find(item => item.menuId === menuId)) {
      setError(null);
      setConfirmation('You have already rated this menu item today.');
      setTimeout(() => setConfirmation(null), 3000);
      return;
    }

    // Restrict: not more than 3 menu items per day
    if (todayActivity.length >= 3) {
      setError(null);
      setConfirmation('You can only rate up to 3 different menu items per day.');
      setTimeout(() => setConfirmation(null), 3000);
      return;
    }

    setRatingSubmitting(true)
    axios.post(`${API_URL}/menus/${menuId}/ratings`, { rating: { stars } })
      .then(() => {
        setUserRatings(prev => ({ ...prev, [menuId]: stars }))
        setPendingRatings(prev => ({ ...prev, [menuId]: 0 }))
        // Save activity
        const updatedActivity = { 
          ...activity, 
          [today]: [...todayActivity, { menuId, timestamp: Date.now() }]
        };
        setRatingActivity(updatedActivity);
        // Refetch and update cache for this category
        fetchMenus(selectedCategory, API_URL)
        setRatingSubmitting(false)
        setError(null);
        setConfirmation('Thank you! Your rating has been submitted.');
        setTimeout(() => setConfirmation(null), 3000);
      })
      .catch(() => {
        setError('Failed to submit rating')
        setConfirmation(null);
        setRatingSubmitting(false)
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      {/* Confirmation/Restriction Message */}
      {confirmation && (
        <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50">
          <div className="bg-green-100 border border-green-300 text-green-800 px-6 py-3 rounded-xl shadow-lg flex items-center gap-2 animate-fade-in">
            <span className="font-semibold">{confirmation}</span>
          </div>
        </div>
      )}

      <div className="relative bg-gradient-to-br from-orange-500 to-red-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-center space-x-4 mb-6">
            <ChefHat className="w-12 h-12 text-white" />
            <h1 className="text-4xl md:text-6xl font-bold text-center text-white [text-shadow:0_2px_4px_rgba(0,0,0,0.1)]">
              Delicious Menu
            </h1>
            <Utensils className="w-12 h-12 text-white" />
          </div>
          <p className="text-xl md:text-2xl text-center text-orange-100 max-w-3xl mx-auto">
            Discover our carefully crafted dishes made with the finest ingredients
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ul className="flex space-x-2 mb-6">
          {loading && (
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
              <div className="flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500 mr-3" />
                <span className="text-lg text-gray-600">Loading categories...</span>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
              <div className="flex items-center justify-center text-red-600">
                <AlertCircle className="w-6 h-6 mr-2" />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {/* {!loading && categories && categories.length > 0 && categories.map(cat => (
            <li key={cat.id}>
              <button
                className={`px-4 py-2 rounded ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.name}
              </button>
            </li>
          ))} */}

        {!loading && categories && categories.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Choose Your Category</h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-6">
              {categories.map((cat) => (
                <button
                  key={cat._id || cat.id}
                  className={`
                    px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-lg
                    ${selectedCategory === (cat._id || cat.id)
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-xl scale-105'
                      : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                    }
                  `}
                  onClick={() => handleCategoryClick(cat.id || cat._id)}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {!loading && (!categories || categories.length === 0) && (
          <div className="text-center py-16">
            <div className="bg-white rounded-xl p-8 shadow-lg max-w-md mx-auto">
              <ChefHat className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <span className="text-lg text-gray-600">No categories found.</span>
            </div>
          </div>
        )}

        </ul>
        <h3 className="text-xl font-semibold mb-2">Menu Items</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(menusByCategory[selectedCategory]?.menus?.length === 0) && <div className="col-span-2 text-gray-500">No menu items found for this category.</div>}
          {(menusByCategory[selectedCategory]?.menus || []).map(menu => (
            <div
              key={menu.id}
              className="group relative bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col items-stretch transition-transform duration-300 hover:scale-105 hover:shadow-2xl border border-orange-100"
            >
              <div className="relative flex items-center justify-center bg-gradient-to-br from-orange-100 to-red-100 min-h-[12rem] max-h-64 overflow-hidden">
                <img
                  src={menu.image || 'https://via.placeholder.com/400x200?text=No+Image'}
                  alt={menu.name}
                  className="max-w-full max-h-56 object-contain drop-shadow-xl transition-transform duration-300 group-hover:scale-110"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400x200?text=No+Image'; }}
                  style={{ width: 'auto', height: 'auto' }}
                />
                {menu.badge && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full px-4 py-1 shadow-md text-sm font-bold">
                    {menu.badge}
                  </div>
                )}
                {menu.outOfStock && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-red-500 text-white rounded-full px-4 py-1 shadow text-xs pick-bold">
                    Sold Out
                  </div>
                )}
              </div>
              <div className="flex-1 flex flex-col justify-between p-6">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-1 truncate">{menu.name}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-orange-600">{menu.price} Birr</span>
                    <span className="text-yellow-500 font-semibold text-sm">Avg: {getAverageRating(menu.ratings)}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2 text-sm">{menu.ingredients}</p>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <StarRating
                    rating={pendingRatings[menu.id] || userRatings[menu.id] || 0}
                    onRate={(stars) => handleStarClick(menu.id, stars)}
                    disabled={ratingSubmitting}
                  />
                  <button
                    className="ml-2 px-4 py-1 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-full font-semibold shadow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    onClick={() => handleSubmitRating(menu.id)}
                    disabled={ratingSubmitting || !(pendingRatings[menu.id] > 0)}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div> 
        
      </div>
      <Footer />
    </div>
  )
}

export default Menu