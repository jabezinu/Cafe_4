class CreateUsers < ActiveRecord::Migration[8.0]
  def change
    create_table :users do |t|
      t.string :phone_number
      t.string :password_digest

      t.timestamps
    end
  end
end
