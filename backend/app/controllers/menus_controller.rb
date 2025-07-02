class MenusController < ApplicationController
  before_action :set_category, only: [:index, :create]

  def index  # getMenusByCategory
    menus = @category.menus
    render json: menus
  end

  def create  # createMenuUnderCategory
    menu = @category.menus.build(menu_params)
    if menu.save
      render json: menu, status: :created
    else
      render json: { errors: menu.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    menu = Menu.find(params[:id])
    render json: menu
  end

  def update  # updateMenu
    menu = Menu.find(params[:id])
    if menu.update(menu_params)
      render json: menu
    else
      render json: { errors: menu.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy  # deleteMenu
    menu = Menu.find(params[:id])
    menu.destroy
    head :no_content
  end

  def average_rating  # getAverageRating (called from Ratings actions, but implemented here)
    menu = Menu.find(params[:id])
    average = menu.ratings.average(:stars).to_f
    render json: { average_rating: average }
  end

  private

  def set_category
    @category = Category.find(params[:category_id])
  end

  def menu_params
    params.require(:menu).permit(:name, :ingredients, :price, :image, :out_of_stock)
  end
end