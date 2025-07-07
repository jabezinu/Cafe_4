import { create } from 'zustand'
import axios from 'axios'

const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes in ms

const useMenuStore = create((set, get) => ({
  menusByCategory: {}, // { [categoryId]: { menus: [], timestamp: number } }
  loading: false,
  error: null,
  async fetchMenus(categoryId, API_URL) {
    const cached = get().menusByCategory[categoryId]
    const now = Date.now()
    if (cached && (now - cached.timestamp < CACHE_DURATION)) return; // Use cache if fresh
    set({ loading: true, error: null })
    try {
      const res = await axios.get(`${API_URL}/categories/${categoryId}/menus`)
      set(state => ({
        menusByCategory: {
          ...state.menusByCategory,
          [categoryId]: { menus: res.data, timestamp: now }
        },
        loading: false,
        error: null
      }))
    } catch (e) {
        console.log(e)
      set({ error: 'Failed to fetch menu items', loading: false })
    }
  },
  clearError() {
    set({ error: null })
  }
}))

export default useMenuStore
