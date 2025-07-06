class Menu < ApplicationRecord
  belongs_to :category
  has_many :ratings, dependent: :destroy

  def average_rating
    ratings.average(:stars).to_f
  end

  def badge
    avg = average_rating
    if avg >= 4.5 && ratings.count >= 3
      'Top Rated'
    elsif avg >= 4.0
      'Popular'
    else
      nil
    end
  end
end