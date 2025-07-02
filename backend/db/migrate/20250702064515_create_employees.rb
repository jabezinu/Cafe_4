class CreateEmployees < ActiveRecord::Migration[8.0]
  def change
    create_table :employees do |t|
      t.string :name
      t.string :phone
      t.string :image
      t.text :description
      t.decimal :salary
      t.date :date_hired
      t.string :position
      t.string :table_assigned
      t.string :working_hour
      t.string :status

      t.timestamps
    end
  end
end
