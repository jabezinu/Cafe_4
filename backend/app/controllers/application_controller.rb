class ApplicationController < ActionController::API
  include ExceptionHandler
  include Authenticable
  
  before_action :authenticate_request!
  
  private
  
  def json_response(object, status = :ok)
    render json: object, status: status
  end
end
