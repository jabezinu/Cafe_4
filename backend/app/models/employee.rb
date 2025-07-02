class Employee < ApplicationRecord
  enum :position, {
    waiter: "waiter",
    cashier: "cashier",
    manager: "manager",
    baresta: "baresta",
    chaf: "chaf"
  }, suffix: true

  enum :status, {
    active: "active",
    fired: "fired",
    resigned: "resigned"
  }, suffix: true
end
