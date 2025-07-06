class CommentsController < ApplicationController
  def index  # getcomment
    comments = Comment.all
    render json: comments
  end

  def create  # Createcomment
    comment = Comment.new(comment_params)
    if comment.save
      render json: comment, status: :created
    else
      render json: { errors: comment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  private

  def comment_params
    params.require(:comment).permit(:name, :phone_no, :comment, :is_anonymous)
  end
end