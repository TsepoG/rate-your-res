locals {
  prefix = "rateyourres-${var.environment}"
}

# Universities table
# PK: universityId (e.g. "ukzn")
resource "aws_dynamodb_table" "universities" {
  name         = "${local.prefix}-universities"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "universityId"

  attribute {
    name = "universityId"
    type = "S"
  }

  attribute {
    name = "province"
    type = "S"
  }

  attribute {
    name = "city"
    type = "S"
  }

  # Query universities by province
  global_secondary_index {
    name            = "province-index"
    hash_key        = "province"
    projection_type = "ALL"
  }

  # Query universities by city
  global_secondary_index {
    name            = "city-index"
    hash_key        = "city"
    projection_type = "ALL"
  }

  tags = {
    Environment = var.environment
    Project     = "rateyourres"
  }
}

# Residences table
# PK: residenceId (e.g. "clarewood-house")
resource "aws_dynamodb_table" "residences" {
  name         = "${local.prefix}-residences"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "residenceId"

  attribute {
    name = "residenceId"
    type = "S"
  }

  attribute {
    name = "universityId"
    type = "S"
  }

  attribute {
    name = "province"
    type = "S"
  }

  # Query residences by university
  global_secondary_index {
    name            = "universityId-index"
    hash_key        = "universityId"
    projection_type = "ALL"
  }

  # Query residences by province (browse/search)
  global_secondary_index {
    name            = "province-index"
    hash_key        = "province"
    projection_type = "ALL"
  }

  tags = {
    Environment = var.environment
    Project     = "rateyourres"
  }
}

# Reviews table
# PK: residenceId, SK: reviewId — allows querying all reviews for a residence
resource "aws_dynamodb_table" "reviews" {
  name         = "${local.prefix}-reviews"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "residenceId"
  range_key    = "reviewId"

  attribute {
    name = "residenceId"
    type = "S"
  }

  attribute {
    name = "reviewId"
    type = "S"
  }

  attribute {
    name = "createdAt"
    type = "S"
  }

  # Sort reviews by date
  local_secondary_index {
    name            = "createdAt-index"
    range_key       = "createdAt"
    projection_type = "ALL"
  }

  tags = {
    Environment = var.environment
    Project     = "rateyourres"
  }
}

# Users table
# PK: userId (Cognito sub)
resource "aws_dynamodb_table" "users" {
  name         = "${local.prefix}-users"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "userId"

  attribute {
    name = "userId"
    type = "S"
  }

  tags = {
    Environment = var.environment
    Project     = "rateyourres"
  }
}
