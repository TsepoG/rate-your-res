locals {
  prefix      = "${var.app_name}-${var.environment}"
  runtime     = "nodejs22.x"
  timeout     = 10
  memory      = 256
  backend_dir = "${path.root}/../backend"
}

# --- IAM role shared by all Lambda functions ---

resource "aws_iam_role" "lambda" {
  name = "${local.prefix}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action    = "sts:AssumeRole"
      Effect    = "Allow"
      Principal = { Service = "lambda.amazonaws.com" }
    }]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "lambda_dynamodb" {
  name = "${local.prefix}-lambda-dynamodb"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:GetItem",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem",
        "dynamodb:Query",
        "dynamodb:Scan",
      ]
      Resource = [
        "arn:aws:dynamodb:${var.aws_region}:*:table/${var.universities_table}*",
        "arn:aws:dynamodb:${var.aws_region}:*:table/${var.residences_table}*",
        "arn:aws:dynamodb:${var.aws_region}:*:table/${var.reviews_table}*",
      ]
    }]
  })
}

resource "aws_iam_role_policy" "lambda_cognito" {
  name = "${local.prefix}-lambda-cognito"
  role = aws_iam_role.lambda.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "cognito-idp:SignUp",
        "cognito-idp:InitiateAuth",
        "cognito-idp:ConfirmSignUp",
        "cognito-idp:ResendConfirmationCode",
        "cognito-idp:AdminGetUser",
      ]
      Resource = var.cognito_user_pool_arn
    }]
  })
}

# --- Single zip of the entire backend (includes shared/utils) ---

data "archive_file" "backend" {
  type        = "zip"
  source_dir  = local.backend_dir
  excludes    = ["node_modules", "package-lock.json", "dist", "*.zip"]
  output_path = "${path.module}/zips/backend.zip"
}

# --- Lambda functions ---
# DLQ not applicable to any function below: all are synchronously invoked by API
# Gateway. DLQs only capture failed async invocations; sync callers receive errors
# directly and Lambda never retries or queues events.

# kics-scan ignore-block
resource "aws_lambda_function" "universities" {
  function_name    = "${local.prefix}-universities"
  role             = aws_iam_role.lambda.arn
  runtime          = local.runtime
  handler          = "functions/universities/handler.handler"
  filename         = data.archive_file.backend.output_path
  source_code_hash = data.archive_file.backend.output_base64sha256
  timeout          = local.timeout
  memory_size      = local.memory

  environment {
    variables = {
      UNIVERSITIES_TABLE                  = var.universities_table
      RESIDENCES_TABLE                    = var.residences_table
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }

  tags = { Environment = var.environment, Project = var.app_name }
}

# kics-scan ignore-block
resource "aws_lambda_function" "residences" {
  function_name    = "${local.prefix}-residences"
  role             = aws_iam_role.lambda.arn
  runtime          = local.runtime
  handler          = "functions/residences/handler.handler"
  filename         = data.archive_file.backend.output_path
  source_code_hash = data.archive_file.backend.output_base64sha256
  timeout          = local.timeout
  memory_size      = local.memory

  environment {
    variables = {
      RESIDENCES_TABLE                    = var.residences_table
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }

  tags = { Environment = var.environment, Project = var.app_name }
}

# kics-scan ignore-block
resource "aws_lambda_function" "reviews" {
  function_name    = "${local.prefix}-reviews"
  role             = aws_iam_role.lambda.arn
  runtime          = local.runtime
  handler          = "functions/reviews/handler.handler"
  filename         = data.archive_file.backend.output_path
  source_code_hash = data.archive_file.backend.output_base64sha256
  timeout          = local.timeout
  memory_size      = local.memory

  environment {
    variables = {
      REVIEWS_TABLE                       = var.reviews_table
      RESIDENCES_TABLE                    = var.residences_table
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }

  tags = { Environment = var.environment, Project = var.app_name }
}

# kics-scan ignore-block
resource "aws_lambda_function" "profile" {
  function_name    = "${local.prefix}-profile"
  role             = aws_iam_role.lambda.arn
  runtime          = local.runtime
  handler          = "functions/profile/handler.handler"
  filename         = data.archive_file.backend.output_path
  source_code_hash = data.archive_file.backend.output_base64sha256
  timeout          = local.timeout
  memory_size      = local.memory

  environment {
    variables = {
      REVIEWS_TABLE                       = var.reviews_table
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }

  tags = { Environment = var.environment, Project = var.app_name }
}

# kics-scan ignore-block
resource "aws_lambda_function" "auth" {
  function_name    = "${local.prefix}-auth"
  role             = aws_iam_role.lambda.arn
  runtime          = local.runtime
  handler          = "functions/auth/handler.handler"
  filename         = data.archive_file.backend.output_path
  source_code_hash = data.archive_file.backend.output_base64sha256
  timeout          = local.timeout
  memory_size      = local.memory

  environment {
    variables = {
      COGNITO_CLIENT_ID                   = var.cognito_client_id
      AWS_NODEJS_CONNECTION_REUSE_ENABLED = "1"
    }
  }

  tags = { Environment = var.environment, Project = var.app_name }
}
