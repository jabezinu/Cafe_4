Rails.application.routes.draw do
  # Employee routes
  resources :employees, only: [:index, :show, :update, :destroy]

  # Comment routes
  resources :comments, only: [:index, :create]

  # Category routes
  resources :categories, only: [:index, :create, :update, :destroy] do
    resources :menus, only: [:index, :create]  # Nested routes for menus under categories
  end

  # Menu routes (top-level for show, update, destroy)
  resources :menus, only: [:show, :update, :destroy] do
    resources :ratings, only: [:index, :create]  # Nested ratings under menus
    get "average_rating", on: :member  # Custom route for average rating
  end
end