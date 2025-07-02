class RatingsController < ApplicationController
  before_action :set_menu, only: [:index, :create]

  def index  # getRatingsForMenu
    ratings = @menu.ratings
    render json: ratings
  end

  def create  # createRating
    rating = @menu.ratings.build(rating_params)
    if rating.save
      render json: rating, status: :created
    else
      render json: { errors: rating.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def set_menu
    @menu = Menu.find(params[:menu_id])
  end

  def rating_params
    params.require(:rating).permit(:stars)
  end
end