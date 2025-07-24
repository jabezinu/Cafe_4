import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Simple Modal component
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-xl shadow-lg p-6 relative min-w-[320px] max-w-lg w-full">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold">&times;</button>
        {children}
      </div>
    </div>
  );
};

const Menu = () => {
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  const [category, setCategory] = useState({ name: '' })
  const [editingId, setEditingId] = useState(null)
  const [menuItem, setMenuItem] = useState({
    name: '',
    ingredients: '',
    price: '',
    image: '',
    out_of_stock: false,
    categoryId: '',
    id: null
  })
  const [menuEditingId, setMenuEditingId] = useState(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showMenuModal, setShowMenuModal] = useState(false)
  const [selectedCategoryId, setSelectedCategoryId] = useState(null)
  // Add state for view modal and selected menu details
  const [showViewModal, setShowViewModal] = useState(false)
  const [viewMenuDetails, setViewMenuDetails] = useState(null)
  const [newRating, setNewRating] = useState(5);
  const [ratingSubmitting, setRatingSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`)
      setCategories(response.data)
      let allMenus = []
      for (const cat of response.data) {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${cat.id}/menus`)
        allMenus = allMenus.concat(res.data.map(item => ({ ...item, categoryId: cat.id })))
      }
      setMenuItems(allMenus)
      // Set default selected category if not set
      if (!selectedCategoryId && response.data.length > 0) {
        setSelectedCategoryId(response.data[0].id)
      }
    } catch (error) {
      console.error('Error fetching categories or menu items:', error)
    }
  }

  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/categories/${editingId}`, category)
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/categories`, category)
      }
      setCategory({ name: '' })
      setEditingId(null)
      setShowCategoryModal(false)
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  const handleEdit = (cat) => {
    setCategory({ name: cat.name })
    setEditingId(cat.id)
    setShowCategoryModal(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  const handleMenuItemChange = (e) => {
    const { name, value, type, checked } = e.target
    setMenuItem({ ...menuItem, [name]: type === 'checkbox' ? checked : value })
  }

  const handleMenuItemSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        name: menuItem.name,
        ingredients: menuItem.ingredients,
        price: menuItem.price,
        image: menuItem.image,
        out_of_stock: menuItem.out_of_stock
      }
      if (menuEditingId) {
        await axios.put(`${import.meta.env.VITE_API_URL}/menus/${menuEditingId}`, { menu: payload })
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/categories/${menuItem.categoryId}/menus`, { menu: payload })
      }
      setMenuItem({ name: '', ingredients: '', price: '', image: '', out_of_stock: false, categoryId: '', id: null })
      setMenuEditingId(null)
      setShowMenuModal(false)
      fetchCategories()
    } catch (error) {
      console.error('Error saving menu item:', error)
    }
  }

  const handleMenuEdit = (item) => {
    setMenuItem({
      name: item.name,
      ingredients: item.ingredients,
      price: item.price,
      image: item.image,
      out_of_stock: item.out_of_stock,
      categoryId: item.categoryId,
      id: item.id
    })
    setMenuEditingId(item.id)
    setShowMenuModal(true)
  }

  const handleMenuDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/menus/${id}`)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting menu item:', error)
    }
  }

  // Function to fetch and show menu details
  const handleViewMenu = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/menus/${id}`)
      console.log('Fetched menu details:', response.data); // Debug log
      setViewMenuDetails(response.data)
      setShowViewModal(true)
      setNewRating(5); // Reset rating when opening modal
    } catch (error) {
      console.error('Error fetching menu details:', error)
    }
  }

  // Function to handle rating submission
  const handleRatingSubmit = async (e) => {
    e.preventDefault();
    setRatingSubmitting(true);
    try {
      const postRes = await axios.post(`${import.meta.env.VITE_API_URL}/menus/${viewMenuDetails.id}/ratings`, {
        rating: { stars: newRating }
      });
      console.log('Rating POST response:', postRes.data); // Debug log
      // Re-fetch menu details to update ratings and average
      await handleViewMenu(viewMenuDetails.id);
      setNewRating(5); // Reset to default
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
    setRatingSubmitting(false);
  };

  // For Add Category
  const openAddCategoryModal = () => {
    setCategory({ name: '' })
    setEditingId(null)
    setShowCategoryModal(true)
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Menu Management</h1>
            <p className="mt-1 text-sm sm:text-base text-gray-500">Manage your menu categories and items</p>
          </div>
          <button
            onClick={openAddCategoryModal}
            className="mt-4 sm:mt-0 inline-flex items-center px-3 py-2 sm:px-4 sm:py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
          >
            {/* Plus icon */}
            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
            Add Category
          </button>
        </div>
        {/* Category Tabs */}
        <div className="mb-6 sm:mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-2 sm:space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategoryId(cat.id)}
                  className={`whitespace-nowrap py-3 px-3 sm:py-4 sm:px-4 border-b-2 font-medium text-xs sm:text-sm ${selectedCategoryId === cat.id ? 'border-pink-500 text-pink-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
                >
                  {cat.name}
                </button>
              ))}
            </nav>
          </div>
        </div>
        {/* Category Actions */}
        {selectedCategoryId && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-0">
              {categories.find(cat => cat.id === selectedCategoryId)?.name || 'Select a Category'}
            </h2>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 w-full sm:w-auto">
              <div className="flex flex-row space-x-2 bg-white rounded-lg shadow-md p-2 sm:p-3 border border-gray-200">
                <button
                  onClick={openAddCategoryModal}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                  Add Category
                </button>
                <button
                  onClick={() => {
                    const cat = categories.find(c => c.id === selectedCategoryId);
                    if (cat) handleEdit(cat);
                  }}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-2.828 0L9 13V11z"/></svg>
                  Edit Category
                </button>
                <button
                  onClick={() => { if (selectedCategoryId) handleDelete(selectedCategoryId); }}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                >
                  <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  Delete Category
                </button>
              </div>
            </div>
          </div>
        )}
        {/* Menu Items Grid */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {selectedCategoryId && (
            <div className="flex justify-between items-center px-4 pt-4 pb-2 sm:px-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900">Menu Items</h3>
              <button
                type="button"
                onClick={() => {
                  setMenuItem({ name: '', ingredients: '', price: '', image: '', out_of_stock: false, categoryId: selectedCategoryId, id: null });
                  setMenuEditingId(null);
                  setShowMenuModal(true);
                }}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-base font-semibold rounded-lg text-white bg-gradient-to-r from-pink-500 to-pink-700 hover:from-pink-600 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500 transition-all duration-200"
                style={{ boxShadow: '0 4px 14px 0 rgba(236, 72, 153, 0.15)' }}
              >
                <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                Add Menu Item
              </button>
            </div>
          )}
          {selectedCategoryId && menuItems.filter(item => item.categoryId === selectedCategoryId).length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 sm:p-6">
              {menuItems.filter(item => item.categoryId === selectedCategoryId).map((item) => (
                <li key={item.id} className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200 hover:shadow-lg transition-shadow duration-200">
                  <div className="w-full flex flex-col sm:flex-row items-center justify-between p-4 sm:p-6 space-y-4 sm:space-y-0 sm:space-x-6">
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-gray-900 text-sm sm:text-base font-medium truncate">{item.name}</h3>
                        {item.out_of_stock && (
                          <span className="flex-shrink-0 inline-block px-2 py-0.5 text-yellow-800 text-xs font-medium bg-yellow-100 rounded-full">
                            Out of Stock
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-gray-500 text-xs sm:text-sm line-clamp-2"><b>Ingredients:</b> {item.ingredients}</p>
                      <p className="mt-2 text-base sm:text-lg font-semibold text-pink-600"><b>Price:</b> {item.price} Birr</p>
                      {/* Ratings and badge can be added here if needed */}
                    </div>
                    {item.image ? (
                      <img
                        className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-300 rounded-full flex-shrink-0 object-cover"
                        src={item.image}
                        alt={item.name}
                      />
                    ) : (
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-400">
                        <svg className="h-8 w-8 sm:h-10 sm:w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="-mt-px flex divide-x divide-gray-200">
                      <div className="w-0 flex-1 flex">
                        <button
                          onClick={() => handleMenuEdit(item)}
                          className="relative w-0 flex-1 inline-flex items-center justify-center py-3 sm:py-4 text-xs sm:text-sm text-gray-700 font-medium border border-transparent hover:text-gray-500"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 11l6.586-6.586a2 2 0 112.828 2.828L11.828 13.828a2 2 0 01-2.828 0L9 13V11z"/></svg>
                          <span className="ml-2 sm:ml-3">Edit</span>
                        </button>
                      </div>
                      <div className="-ml-px w-0 flex-1 flex">
                        <button
                          onClick={() => handleMenuDelete(item.id)}
                          className="relative w-0 flex-1 inline-flex items-center justify-center py-3 sm:py-4 text-xs sm:text-sm text-red-600 font-medium border border-transparent rounded-br-lg hover:text-red-500"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                          <span className="ml-2 sm:ml-3">Delete</span>
                        </button>
                      </div>
                      {/* View Button */}
                      <div className="-ml-px w-0 flex-1 flex">
                        <button
                          onClick={() => handleViewMenu(item.id)}
                          className="relative w-0 flex-1 inline-flex items-center justify-center py-3 sm:py-4 text-xs sm:text-sm text-blue-600 font-medium border border-transparent rounded-br-lg hover:text-blue-500"
                        >
                          <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm6 0c0 5-7 9-7 9s-7-4-7-9a7 7 0 0114 0z"/></svg>
                          <span className="ml-2 sm:ml-3">View</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : selectedCategoryId ? (
            <div className="text-center py-8 sm:py-12">
              <svg
                className="mx-auto h-10 w-10 sm:h-12 sm:w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                />
              </svg>
              <h3 className="mt-2 text-sm sm:text-base font-medium text-gray-900">No menu items</h3>
              <p className="mt-1 text-xs sm:text-sm text-gray-500">
                Get started by creating a new menu item.
              </p>
            </div>
          ) : null}
        </div>
        {/* Modals remain unchanged */}
        {/* Category Modal */}
        <Modal isOpen={showCategoryModal} onClose={() => { setShowCategoryModal(false); setEditingId(null); setCategory({ name: '' }) }}>
          <form onSubmit={handleSubmit}>
            <h2 className="text-xl font-bold mb-4 text-pink-600">{editingId ? 'Edit' : 'Add'} Category</h2>
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              value={category.name}
              onChange={handleChange}
              className="border border-gray-300 focus:ring-pink-500 focus:border-pink-500 rounded-md p-3 w-full mb-4 text-gray-700"
              required
            />
            <div className="flex space-x-2">
              <button type="submit" className="flex items-center gap-1 bg-gradient-to-r from-pink-500 to-pink-700 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 hover:from-pink-600 hover:to-pink-800 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all duration-200">
                {editingId ? (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>) : (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>)}
                {editingId ? 'Update' : 'Add'}
              </button>
              <button type="button" onClick={() => { setShowCategoryModal(false); setEditingId(null); setCategory({ name: '' }) }} className="flex items-center gap-1 px-5 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 shadow transition-all duration-200">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                Cancel
              </button>
            </div>
          </form>
        </Modal>
        {/* Menu Item Modal */}
        <Modal isOpen={showMenuModal} onClose={() => { setShowMenuModal(false); setMenuEditingId(null); setMenuItem({ name: '', ingredients: '', price: '', image: '', out_of_stock: false, categoryId: '', id: null }) }}>
          <form onSubmit={handleMenuItemSubmit}>
            <h2 className="text-xl font-bold mb-4 text-pink-600">{menuEditingId ? 'Edit' : 'Add'} Menu Item</h2>
            <div className="grid grid-cols-1 gap-4">
              <input type="text" name="name" placeholder="Menu Item Name" value={menuItem.name} onChange={handleMenuItemChange} className="border border-gray-300 focus:ring-pink-500 focus:border-pink-500 rounded-md p-3 w-full text-gray-700" required />
              <input type="text" name="ingredients" placeholder="Ingredients" value={menuItem.ingredients} onChange={handleMenuItemChange} className="border border-gray-300 focus:ring-pink-500 focus:border-pink-500 rounded-md p-3 w-full text-gray-700" required />
              <input type="number" name="price" placeholder="Price" value={menuItem.price} onChange={handleMenuItemChange} className="border border-gray-300 focus:ring-pink-500 focus:border-pink-500 rounded-md p-3 w-full text-gray-700" required />
              <input type="text" name="image" placeholder="Image URL" value={menuItem.image} onChange={handleMenuItemChange} className="border border-gray-300 focus:ring-pink-500 focus:border-pink-500 rounded-md p-3 w-full text-gray-700" required />
              <div className="flex items-center space-x-2">
                <input type="checkbox" name="out_of_stock" checked={menuItem.out_of_stock} onChange={handleMenuItemChange} className="h-5 w-5 text-pink-600 focus:ring-pink-500 border-gray-300 rounded" />
                <label className="text-gray-700 font-medium">Out of Stock</label>
              </div>
              <select
                name="categoryId"
                value={menuItem.categoryId}
                onChange={handleMenuItemChange}
                className="border border-gray-300 focus:ring-pink-500 focus:border-pink-500 rounded-md p-3 w-full text-gray-700"
                required
                disabled={!!menuEditingId}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div className="flex space-x-2">
                <button type="submit" className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-green-700 text-white px-5 py-2 rounded-full font-semibold shadow hover:scale-105 hover:from-green-600 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200">
                  {menuEditingId ? (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/></svg>) : (<svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>)}
                  {menuEditingId ? 'Update' : 'Add'}
                </button>
                <button type="button" onClick={() => { setShowMenuModal(false); setMenuEditingId(null); setMenuItem({ name: '', ingredients: '', price: '', image: '', out_of_stock: false, categoryId: '', id: null }) }} className="flex items-center gap-1 px-5 py-2 rounded-full bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 shadow transition-all duration-200">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </Modal>
        {/* View Menu Item Modal */}
        <Modal isOpen={showViewModal} onClose={() => { setShowViewModal(false); setViewMenuDetails(null) }}>
          {viewMenuDetails ? (
            <div>
              <h2 className="text-xl font-bold mb-4 text-pink-600">Menu Item Details</h2>
              <div className="flex flex-col items-center mb-4">
                {viewMenuDetails.image ? (
                  <img src={viewMenuDetails.image} alt={viewMenuDetails.name} className="w-24 h-24 rounded-full object-cover mb-2" />
                ) : (
                  <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center text-gray-400 mb-2">
                    <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900">{viewMenuDetails.name}</h3>
                <p className="text-gray-600">{viewMenuDetails.ingredients}</p>
                <p className="text-pink-600 font-bold">{viewMenuDetails.price} Birr</p>
                {viewMenuDetails.out_of_stock && (
                  <span className="inline-block px-2 py-0.5 text-yellow-800 text-xs font-medium bg-yellow-100 rounded-full mt-2">Out of Stock</span>
                )}
              </div>
              {/* Ratings */}
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-1">Ratings</h4>
                <p className="text-gray-700 text-sm">Number of ratings: {viewMenuDetails.ratings ? viewMenuDetails.ratings.length : 0}</p>
                <p className="text-gray-700 text-sm">Average rating: {viewMenuDetails.ratings && viewMenuDetails.ratings.length > 0 ? (viewMenuDetails.ratings.reduce((sum, r) => sum + (r.stars || 0), 0) / viewMenuDetails.ratings.length).toFixed(2) : 'N/A'}</p>
              </div>
              {/* Rating Submission Form */}
              <form onSubmit={handleRatingSubmit} className="mt-4 flex items-center space-x-2">
                <label htmlFor="rating" className="text-gray-700 font-medium">Rate this item:</label>
                <select
                  id="rating"
                  value={newRating}
                  onChange={e => setNewRating(Number(e.target.value))}
                  className="border border-gray-300 rounded-md p-1"
                  disabled={ratingSubmitting}
                >
                  {[1,2,3,4,5].map(star => (
                    <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="bg-pink-500 text-white px-3 py-1 rounded-md font-semibold hover:bg-pink-600"
                  disabled={ratingSubmitting}
                >
                  {ratingSubmitting ? 'Submitting...' : 'Submit'}
                </button>
              </form>
              {/* Other details if needed */}
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </Modal>
      </div>
    </div>
  )
}

export default Menu
