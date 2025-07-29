module Api
  module V1
    class SessionsController < ApplicationController
      skip_before_action :authenticate_request, only: :create

      def create
        user = User.find_by(phone_number: params[:phone_number])
        
        if user&.authenticate(params[:password])
          token = JwtService.encode(user_id: user.id)
          render json: { token: token, user: { id: user.id, phone_number: user.phone_number } }, status: :ok
        else
          render json: { error: 'Invalid phone number or password' }, status: :unauthorized
        end
      end
    end
  end
end
