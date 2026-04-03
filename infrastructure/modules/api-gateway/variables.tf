variable "environment" {
  type = string
}

variable "app_name" {
  type = string
}

variable "lambda_arns" {
  description = "Map of Lambda invoke ARNs (for API Gateway integrations)"
  type = object({
    universities = string
    residences   = string
    reviews      = string
    auth         = string
  })
}

variable "lambda_function_arns" {
  description = "Map of Lambda function ARNs (for Lambda permissions)"
  type = object({
    universities = string
    residences   = string
    reviews      = string
    auth         = string
  })
}
