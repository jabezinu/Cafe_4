class Category < ApplicationRecord
  has_many :menus, dependent: :destroy
end