# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2025_07_24_091955) do
  create_table "categories", force: :cascade do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "comments", force: :cascade do |t|
    t.string "name"
    t.string "phone_no"
    t.text "comment"
    t.boolean "is_anonymous"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "employees", force: :cascade do |t|
    t.string "name"
    t.string "phone"
    t.string "image"
    t.text "description"
    t.decimal "salary"
    t.date "date_hired"
    t.string "position"
    t.string "table_assigned"
    t.string "working_hour"
    t.string "status"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "password_digest"
  end

  create_table "menus", force: :cascade do |t|
    t.string "name"
    t.text "ingredients"
    t.decimal "price"
    t.string "image"
    t.boolean "out_of_stock"
    t.integer "category_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["category_id"], name: "index_menus_on_category_id"
  end

  create_table "ratings", force: :cascade do |t|
    t.integer "stars"
    t.integer "menu_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["menu_id"], name: "index_ratings_on_menu_id"
  end

  add_foreign_key "menus", "categories"
  add_foreign_key "ratings", "menus"
end
