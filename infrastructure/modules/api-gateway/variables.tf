variable "environment" {
  type = string
}

variable "app_name" {
  type = string
}

variable "lambda_arns" {
  description = "Map of Lambda function ARNs keyed by function name"
  type = object({
    universities = string
    residences   = string
    reviews      = string
    auth         = string
  })
}
