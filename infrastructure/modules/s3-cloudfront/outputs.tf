output "cloudfront_url" {
  value = "https://${aws_cloudfront_distribution.frontend.domain_name}"
}

output "cloudfront_distribution_id" {
  value = aws_cloudfront_distribution.frontend.id
}

output "frontend_bucket_name" {
  value = aws_s3_bucket.frontend.bucket
}

output "images_bucket_name" {
  value = aws_s3_bucket.images.bucket
}

output "images_bucket_arn" {
  value = aws_s3_bucket.images.arn
}
