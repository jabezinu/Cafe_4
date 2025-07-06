import React, { useEffect, useState } from 'react'

const OutOfStock = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = 'http://localhost:3000/menus/out_of_stock';

  useEffect(() => {
    fetch(API_URL)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
        return res.json();
      })
      .then(data => {
        setMenus(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Out of Stock Menu Items</h2>
      {menus.length === 0 ? (
        <p>No out of stock items found.</p>
      ) : (
        <ul>
          {menus.map(menu => (
            <li key={menu.id} style={{marginBottom: '1rem'}}>
              <strong>{menu.name}</strong> - {menu.ingredients}<br/>
              Price: ${menu.price} <br/>
              {menu.image && <img src={menu.image} alt={menu.name} style={{width: '100px'}} />}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default OutOfStock
