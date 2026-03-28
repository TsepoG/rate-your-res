output "api_gateway_url" {
  description = "Base URL for the API Gateway"
  value       = module.api_gateway.api_url
}

output "cloudfront_url" {
  description = "CloudFront distribution URL for the frontend"
  value       = module.s3_cloudfront.cloudfront_url
}

output "cognito_user_pool_id" {
  description = "Cognito User Pool ID"
  value       = module.cognito.user_pool_id
}

output "cognito_client_id" {
  description = "Cognito App Client ID"
  value       = module.cognito.client_id
}
