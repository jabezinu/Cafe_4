class User < ApplicationRecord
  has_secure_password

  validates :phone_number, presence: true, 
                          uniqueness: true,
                          format: { with: /\A\+?[0-9]{10,15}\z/, message: "should be a valid phone number" }
  validates :password, length: { minimum: 6 }, if: -> { password.present? }

  before_save :normalize_phone_number

  private

  def normalize_phone_number
    self.phone_number = phone_number.gsub(/[^0-9+]/, '')
  end
end
