module Api
  module V1
    class UsersController < ApplicationController
      skip_before_action :authenticate_request, only: :create
      
      def create
        user = User.new(user_params)
        if user.save
          token = JwtService.encode(user_id: user.id)
          render json: { 
            user: user.as_json(only: [:id, :phone_number]),
            token: token 
          }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update_password
        if @current_user.authenticate(params[:current_password])
          if @current_user.update(password: params[:new_password])
            render json: { message: 'Password updated successfully' }, status: :ok
          else
            render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Current password is incorrect' }, status: :unauthorized
        end
      end

      def update_phone_number
        if @current_user.authenticate(params[:current_password])
          if @current_user.update(phone_number: params[:new_phone_number])
            render json: { 
              message: 'Phone number updated successfully',
              user: { id: @current_user.id, phone_number: @current_user.phone_number }
            }, status: :ok
          else
            render json: { errors: @current_user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { error: 'Current password is incorrect' }, status: :unauthorized
        end
      end

      private

      def user_params
        params.require(:user).permit(:phone_number, :password, :password_confirmation)
      end
    end
  end
end
