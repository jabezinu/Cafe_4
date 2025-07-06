import React, { useEffect, useState } from 'react'
import axios from 'axios'

// Menu management page
const Menu = () => {
  // State for categories and menu items
  const [categories, setCategories] = useState([])
  const [menuItems, setMenuItems] = useState([])
  // State for category form
  const [category, setCategory] = useState({ name: '' })
  const [editingId, setEditingId] = useState(null)
  // State for menu item form
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

  // Fetch categories and menu items on mount
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/categories`)
      setCategories(response.data)
      // Fetch menu items after categories are loaded
      let allMenus = []
      for (const cat of response.data) {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/categories/${cat.id}/menus`)
        allMenus = allMenus.concat(res.data.map(item => ({ ...item, categoryId: cat.id })))
      }
      setMenuItems(allMenus)
    } catch (error) {
      console.error('Error fetching categories or menu items:', error)
    }
  }

  // Handle category form input change
  const handleChange = (e) => {
    setCategory({ ...category, [e.target.name]: e.target.value })
  }

  // Handle category form submit (Create/Update)
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
      fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
    }
  }

  // Edit category
  const handleEdit = (cat) => {
    setCategory({ name: cat.name })
    setEditingId(cat.id)
  }

  // Delete category
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/categories/${id}`)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  // Handle menu item form input change
  const handleMenuItemChange = (e) => {
    const { name, value, type, checked } = e.target
    setMenuItem({ ...menuItem, [name]: type === 'checkbox' ? checked : value })
  }

  // Handle menu item form submit (Create/Update)
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
      fetchCategories()
    } catch (error) {
      console.error('Error saving menu item:', error)
    }
  }

  // Edit menu item
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
  }

  // Delete menu item
  const handleMenuDelete = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/menus/${id}`)
      fetchCategories()
    } catch (error) {
      console.error('Error deleting menu item:', error)
    }
  }

  // Render UI
  return (
    <div className="max-w-xl mx-auto p-4">
      {/* Category Form */}
      <form onSubmit={handleSubmit} className="mb-6 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">{editingId ? 'Edit' : 'Add'} Category</h2>
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          value={category.name}
          onChange={handleChange}
          className="border p-2 w-full mb-2"
          required
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setCategory({ name: '' }) }} className="ml-2 px-4 py-2 rounded bg-gray-400 text-white">Cancel</button>
        )}
      </form>
      {/* Menu Item Form */}
      <form onSubmit={handleMenuItemSubmit} className="mb-6 bg-gray-100 p-4 rounded">
        <h2 className="text-xl font-bold mb-2">{menuEditingId ? 'Edit' : 'Add'} Menu Item</h2>
        <input
          type="text"
          name="name"
          placeholder="Menu Item Name"
          value={menuItem.name}
          onChange={handleMenuItemChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          name="ingredients"
          placeholder="Ingredients"
          value={menuItem.ingredients}
          onChange={handleMenuItemChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={menuItem.price}
          onChange={handleMenuItemChange}
          className="border p-2 w-full mb-2"
          required
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={menuItem.image}
          onChange={handleMenuItemChange}
          className="border p-2 w-full mb-2"
        />
        <label className="flex items-center mb-2">
          <input
            type="checkbox"
            name="out_of_stock"
            checked={menuItem.out_of_stock}
            onChange={handleMenuItemChange}
            className="mr-2"
          />
          Out of Stock
        </label>
        <select
          name="categoryId"
          value={menuItem.categoryId}
          onChange={handleMenuItemChange}
          className="border p-2 w-full mb-2"
          required
          disabled={!!menuEditingId}
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          {menuEditingId ? 'Update' : 'Add'}
        </button>
        {menuEditingId && (
          <button type="button" onClick={() => { setMenuEditingId(null); setMenuItem({ name: '', ingredients: '', price: '', image: '', out_of_stock: false, categoryId: '', id: null }) }} className="ml-2 px-4 py-2 rounded bg-gray-400 text-white">Cancel</button>
        )}
      </form>
      {/* Category Cards and Menu Items */}
      <div className="grid grid-cols-2 gap-4">
        {categories.map((category) => (
          <div key={category.id} className="mb-4 p-2 border rounded bg-white">
            <h2 className="text-xl font-bold">{category.name}</h2>
            {/* Menu items for this category */}
            <div className="mt-2">
              {menuItems
                .filter((item) => item.categoryId === category.id)
                .map((item) => {
                  const ratings = item.ratings || [];
                  const avgRating = ratings.length > 0 ? (ratings.reduce((sum, r) => sum + (r.stars || 0), 0) / ratings.length).toFixed(2) : 'N/A';
                  return (
                    <div key={item.id} className="p-2 border-b">
                      <h3 className="font-bold">{item.name}</h3>
                      <p><b>Ingredients:</b> {item.ingredients}</p>
                      <p><b>Price:</b> {item.price}</p>
                      <p><b>Image:</b> <img src={item.image} alt={item.name} className="w-24 h-24 object-cover" /></p>
                      <p><b>Average Rating:</b> {avgRating}</p>
                      <p><b>Total Ratings:</b> {ratings.length}</p>
                      <p><b>Out of Stock:</b> {item.out_of_stock ? 'Yes' : 'No'}</p>
                      <button onClick={() => handleMenuEdit(item)} className="mr-2 px-2 py-1 bg-yellow-400 text-white rounded">Edit</button>
                      <button onClick={() => handleMenuDelete(item.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  );
                })}
            </div>
            <button onClick={() => handleEdit(category)} className="mr-2 px-2 py-1 bg-yellow-400 text-white rounded">Edit</button>
            <button onClick={() => handleDelete(category.id)} className="px-2 py-1 bg-red-500 text-white rounded">Delete</button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Menu
