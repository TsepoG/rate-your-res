terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  # Remote state — configure before first apply
  # backend "s3" {
  #   bucket = "rateyourres-terraform-state"
  #   key    = "terraform.tfstate"
  #   region = "af-south-1"
  # }
}

provider "aws" {
  region = var.aws_region
}

module "dynamodb" {
  source      = "./modules/dynamodb"
  environment = var.environment
}

module "cognito" {
  source      = "./modules/cognito"
  environment = var.environment
  app_name    = var.app_name
}

module "s3_cloudfront" {
  source      = "./modules/s3-cloudfront"
  environment = var.environment
  app_name    = var.app_name
}

module "lambda" {
  source               = "./modules/lambda"
  environment          = var.environment
  app_name             = var.app_name
  universities_table   = module.dynamodb.universities_table_name
  residences_table     = module.dynamodb.residences_table_name
  reviews_table        = module.dynamodb.reviews_table_name
  cognito_client_id    = module.cognito.client_id
  aws_region           = var.aws_region
}

module "api_gateway" {
  source               = "./modules/api-gateway"
  environment          = var.environment
  app_name             = var.app_name
  lambda_arns          = module.lambda.invoke_arns
  lambda_function_arns = module.lambda.function_arns
}
