module Authenticable
  extend ActiveSupport::Concern
  include ActionController::HttpAuthentication::Token::ControllerMethods

  included do
    before_action :authenticate_request!
    attr_reader :current_user
  end

  private

  def authenticate_request!
    @current_user = find_user
    render json: { error: 'Not Authorized' }, status: :unauthorized unless @current_user
  end

  def find_user
    return unless token_payload
    User.find_by(id: token_payload[:user_id])
  end

  def token_payload
    return @token_payload if defined?(@token_payload)
    @token_payload = JwtService.decode(http_auth_token) if http_auth_token
  rescue JWT::DecodeError
    nil
  end

  def http_auth_token
    return @http_auth_token if defined?(@http_auth_token)
    @http_auth_token = if request.headers['Authorization'].present?
      request.headers['Authorization'].split(' ').last
    end
  end
end
