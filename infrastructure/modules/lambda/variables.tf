variable "environment" {
  description = "Deployment environment"
  type        = string
}

variable "app_name" {
  description = "Application name"
  type        = string
}

variable "aws_region" {
  description = "AWS region where resources are deployed"
  type        = string
}

variable "universities_table" {
  description = "DynamoDB table name for universities"
  type        = string
}

variable "residences_table" {
  description = "DynamoDB table name for residences"
  type        = string
}

variable "reviews_table" {
  description = "DynamoDB table name for reviews"
  type        = string
}

variable "cognito_client_id" {
  description = "Cognito user pool client ID"
  type        = string
}

variable "cognito_user_pool_arn" {
  description = "Cognito user pool ARN used to scope IAM permissions"
  type        = string
}
