class CreateComments < ActiveRecord::Migration[8.0]
  def change
    create_table :comments do |t|
      t.string :name
      t.string :phone_no
      t.text :comment
      t.boolean :is_anonymous

      t.timestamps
    end
  end
end
