module ExceptionHandler
  extend ActiveSupport::Concern

  included do
    rescue_from ActiveRecord::RecordNotFound do |e|
      json_response({ message: e.message }, :not_found)
    end

    rescue_from ActiveRecord::RecordInvalid do |e|
      json_response({ message: e.message }, :unprocessable_entity)
    end

    rescue_from ExceptionHandler::InvalidToken do |e|
      json_response({ message: 'Invalid token' }, :unauthorized)
    end

    rescue_from ExceptionHandler::MissingToken do |e|
      json_response({ message: 'Missing token' }, :unauthorized)
    end
  end

  class InvalidToken < StandardError; end
  class MissingToken < StandardError; end
end
