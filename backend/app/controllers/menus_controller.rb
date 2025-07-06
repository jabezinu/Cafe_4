class MenusController < ApplicationController
  before_action :set_category, only: [:index, :create]

  def index  # getMenusByCategory
    menus = @category.menus.includes(:ratings)
    render json: menus.as_json(methods: [:badge], include: { ratings: { only: :stars } })
  end

  def create  # createMenuUnderCategory
    menu = @category.menus.build(menu_params)
    if menu.save
      render json: menu.as_json(methods: [:badge], include: { ratings: { only: :stars } }), status: :created
    else
      render json: { errors: menu.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def show
    menu = Menu.find(params[:id])
    render json: menu.as_json(methods: [:badge], include: { ratings: { only: :stars } })
  end

  def update  # updateMenu
    menu = Menu.find(params[:id])
    if menu.update(menu_params)
      render json: menu.as_json(methods: [:badge], include: { ratings: { only: :stars } })
    else
      render json: { errors: menu.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy  # deleteMenu
    menu = Menu.find(params[:id])
    menu.destroy
    head :no_content
  end

  # GET /menus/out_of_stock
  def out_of_stock
    menus = Menu.where(out_of_stock: true).includes(:ratings)
    render json: menus.as_json(methods: [:badge], include: { ratings: { only: :stars } })
  end

  private

  def set_category
    @category = Category.find(params[:category_id])
  end

  def menu_params
    params.require(:menu).permit(:name, :ingredients, :price, :image, :out_of_stock)
  end
end