import React, { useEffect, useState } from 'react'
import axios from 'axios';

const OutOfStock = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const API_URL = 'http://localhost:3000/menus/out_of_stock';

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setMenus(res.data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Failed to fetch');
      setLoading(false);
    }
  };

  const handleToggle = async (menu) => {
    setUpdatingId(menu.id);
    try {
      await axios.patch(`http://localhost:3000/menus/${menu.id}`, {
        menu: { out_of_stock: !menu.out_of_stock }
      });
      fetchMenus();
      // Option 2: Optimistically update UI (uncomment below if preferred)
      // setMenus(menus.map(m => m.id === menu.id ? { ...m, out_of_stock: !m.out_of_stock } : m));
    } catch (err) {
      setError(err.message || 'Failed to update');
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center text-pink-700">Out of Stock Menu Items</h1>
      {menus.length === 0 ? (
        <p>No out of stock items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {menus.map(menu => (
            <div key={menu.id} className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-shadow p-6 flex flex-col items-center relative">
              {menu.image && (
                <img src={menu.image} alt={menu.name} className="w-32 h-32 object-cover rounded-full mb-4 border-4 border-pink-200" />
              )}
              <h2 className="text-xl font-semibold text-pink-700 mb-2">{menu.name}</h2>
              <p className="text-gray-600 mb-2">{menu.ingredients}</p>
              <p className="text-gray-800 font-bold mb-2">${menu.price}</p>
              <div className="flex items-center gap-2 mb-2">
                <span className={`px-2 py-1 rounded text-xs font-semibold ${menu.out_of_stock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                  {menu.out_of_stock ? 'Out of Stock' : 'In Stock'}
                </span>
                <button
                  onClick={() => handleToggle(menu)}
                  disabled={updatingId === menu.id}
                  className={`ml-2 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors focus:outline-none ${menu.out_of_stock ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'} ${updatingId === menu.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {updatingId === menu.id ? 'Updating...' : menu.out_of_stock ? 'Mark In Stock' : 'Mark Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default OutOfStock
