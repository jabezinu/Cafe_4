class Rating < ApplicationRecord
  belongs_to :menu
  validates :stars, inclusion: { in: 1..5 }
end