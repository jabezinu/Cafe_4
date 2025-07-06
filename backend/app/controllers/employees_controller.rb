class EmployeesController < ApplicationController
  def index  # getEmployees
    employees = Employee.all
    render json: employees
  end

  def show  # getEmployeeById
    employee = Employee.find(params[:id])
    render json: employee
  end

  def create  # createEmployee
    employee = Employee.new(employee_params)
    if employee.save
      render json: employee, status: :created
    else
      render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def update  # updateEmployee
    employee = Employee.find(params[:id])
    if employee.update(employee_params)
      render json: employee
    else
      render json: { errors: employee.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy  # deleteEmployee
    employee = Employee.find(params[:id])
    employee.destroy
    head :no_content
  end

  private

  def employee_params
    params.require(:employee).permit(:name, :phone, :image, :description, :salary, :date_hired, :position, :table_assigned, :working_hour, :status)
  end
end