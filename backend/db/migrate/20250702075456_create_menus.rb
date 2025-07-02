class CreateMenus < ActiveRecord::Migration[8.0]
  def change
    create_table :menus do |t|
      t.string :name
      t.text :ingredients
      t.decimal :price
      t.string :image
      t.boolean :out_of_stock
      t.references :category, null: false, foreign_key: true

      t.timestamps
    end
  end
end
