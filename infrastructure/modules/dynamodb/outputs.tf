output "universities_table_name" {
  value = aws_dynamodb_table.universities.name
}

output "universities_table_arn" {
  value = aws_dynamodb_table.universities.arn
}

output "residences_table_name" {
  value = aws_dynamodb_table.residences.name
}

output "residences_table_arn" {
  value = aws_dynamodb_table.residences.arn
}

output "reviews_table_name" {
  value = aws_dynamodb_table.reviews.name
}

output "reviews_table_arn" {
  value = aws_dynamodb_table.reviews.arn
}

output "users_table_name" {
  value = aws_dynamodb_table.users.name
}

output "users_table_arn" {
  value = aws_dynamodb_table.users.arn
}
