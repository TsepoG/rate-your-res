output "function_arns" {
  value = {
    universities = aws_lambda_function.universities.arn
    residences   = aws_lambda_function.residences.arn
    reviews      = aws_lambda_function.reviews.arn
    auth         = aws_lambda_function.auth.arn
  }
}

output "function_names" {
  value = {
    universities = aws_lambda_function.universities.function_name
    residences   = aws_lambda_function.residences.function_name
    reviews      = aws_lambda_function.reviews.function_name
    auth         = aws_lambda_function.auth.function_name
  }
}

output "invoke_arns" {
  value = {
    universities = aws_lambda_function.universities.invoke_arn
    residences   = aws_lambda_function.residences.invoke_arn
    reviews      = aws_lambda_function.reviews.invoke_arn
    auth         = aws_lambda_function.auth.invoke_arn
  }
}
