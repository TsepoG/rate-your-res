variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "lambda_arns" {
  description = "Map of Lambda invoke ARNs (for API Gateway integrations)"
  type = object({
    universities = string
    residences   = string
    reviews      = string
    auth         = string
    profile      = string
  })
}

variable "lambda_function_arns" {
  description = "Map of Lambda function ARNs (for Lambda permissions)"
  type = object({
    universities = string
    residences   = string
    reviews      = string
    auth         = string
    profile      = string
  })
}

variable "cognito_user_pool_id" {
  description = "Cognito User Pool ID for JWT authorizer"
  type        = string
}

variable "cognito_client_id" {
  description = "Cognito App Client ID (JWT audience)"
  type        = string
}

variable "aws_region" {
  description = "AWS region where Cognito is deployed"
  type        = string
}
