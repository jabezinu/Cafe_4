class CreateRatings < ActiveRecord::Migration[8.0]
  def change
    create_table :ratings do |t|
      t.integer :stars
      t.references :menu, null: false, foreign_key: true

      t.timestamps
    end
  end
end
