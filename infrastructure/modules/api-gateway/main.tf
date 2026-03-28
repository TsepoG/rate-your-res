locals {
  prefix = "${var.app_name}-${var.environment}"
}

resource "aws_apigatewayv2_api" "main" {
  name          = "${local.prefix}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 300
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true
}

# --- Lambda integrations ---

resource "aws_apigatewayv2_integration" "universities" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.lambda_arns.universities
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "residences" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.lambda_arns.residences
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "reviews" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.lambda_arns.reviews
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_integration" "auth" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.lambda_arns.auth
  payload_format_version = "2.0"
}

# --- Routes ---

# Universities
resource "aws_apigatewayv2_route" "list_universities" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /universities"
  target    = "integrations/${aws_apigatewayv2_integration.universities.id}"
}

resource "aws_apigatewayv2_route" "get_university" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /universities/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.universities.id}"
}

resource "aws_apigatewayv2_route" "list_university_residences" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /universities/{id}/residences"
  target    = "integrations/${aws_apigatewayv2_integration.universities.id}"
}

# Residences
resource "aws_apigatewayv2_route" "get_residence" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /residences/{id}"
  target    = "integrations/${aws_apigatewayv2_integration.residences.id}"
}

resource "aws_apigatewayv2_route" "search_residences" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /residences/search"
  target    = "integrations/${aws_apigatewayv2_integration.residences.id}"
}

# Reviews
resource "aws_apigatewayv2_route" "list_reviews" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /residences/{id}/reviews"
  target    = "integrations/${aws_apigatewayv2_integration.reviews.id}"
}

resource "aws_apigatewayv2_route" "create_review" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /residences/{id}/reviews"
  target    = "integrations/${aws_apigatewayv2_integration.reviews.id}"
}

# Auth
resource "aws_apigatewayv2_route" "signup" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /auth/signup"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

resource "aws_apigatewayv2_route" "verify" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /auth/verify"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

resource "aws_apigatewayv2_route" "resend" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /auth/resend"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

resource "aws_apigatewayv2_route" "signin" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /auth/signin"
  target    = "integrations/${aws_apigatewayv2_integration.auth.id}"
}

# --- Lambda permissions for API Gateway ---

resource "aws_lambda_permission" "universities" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_arns.universities
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "residences" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_arns.residences
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "reviews" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_arns.reviews
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

resource "aws_lambda_permission" "auth" {
  statement_id  = "AllowAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = var.lambda_arns.auth
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}
