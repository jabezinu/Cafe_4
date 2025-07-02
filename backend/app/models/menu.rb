class Menu < ApplicationRecord
  belongs_to :category
  has_many :ratings, dependent: :destroy
end