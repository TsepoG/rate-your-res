locals {
  prefix = "${var.app_name}-${var.environment}"
}

resource "aws_cognito_user_pool" "main" {
  name = "${local.prefix}-user-pool"

  # Use email as the username
  username_attributes      = ["email"]
  auto_verified_attributes = ["email"]

  # Password policy
  password_policy {
    minimum_length                   = 8
    require_lowercase                = true
    require_uppercase                = true
    require_numbers                  = true
    require_symbols                  = false
    temporary_password_validity_days = 7
  }

  # Email verification
  verification_message_template {
    default_email_option = "CONFIRM_WITH_CODE"
    email_subject        = "Your RateYourRes verification code"
    email_message        = "Your verification code is {####}. It expires in 10 minutes."
  }

  # User attributes
  schema {
    name                     = "email"
    attribute_data_type      = "String"
    required                 = true
    mutable                  = false

    string_attribute_constraints {
      min_length = 5
      max_length = 254
    }
  }

  schema {
    name                = "university_id"
    attribute_data_type = "String"
    required            = false
    mutable             = true

    string_attribute_constraints {
      min_length = 1
      max_length = 50
    }
  }

  # Account recovery
  account_recovery_setting {
    recovery_mechanism {
      name     = "verified_email"
      priority = 1
    }
  }

  tags = {
    Environment = var.environment
    Project     = var.app_name
  }
}

resource "aws_cognito_user_pool_client" "main" {
  name         = "${local.prefix}-client"
  user_pool_id = aws_cognito_user_pool.main.id

  # No client secret — public SPA client
  generate_secret = false

  # Token validity
  access_token_validity  = 1   # hours
  id_token_validity      = 1   # hours
  refresh_token_validity = 30  # days

  # kics-scan ignore-block
  token_validity_units {
    access_token  = "hours"
    id_token      = "hours"
    refresh_token = "days"
  }

  explicit_auth_flows = [
    "ALLOW_USER_PASSWORD_AUTH",
    "ALLOW_REFRESH_TOKEN_AUTH",
    "ALLOW_USER_SRP_AUTH",
  ]

  # Prevent user existence errors leaking
  prevent_user_existence_errors = "ENABLED"
}
