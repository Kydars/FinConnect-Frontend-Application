resource "aws_iam_role" "iam_for_frontend" {
  name = "SENG3011_${var.group_name}_iam_for_frontend"

  assume_role_policy = jsonencode(
    {
      Version = "2012-10-17",
      Statement = [
        {
          Action = "sts:AssumeRole",
          Principal = {
            Service = "apigateway.amazonaws.com"
          },
          Effect = "Allow",
          Sid    = ""
        }
      ]
  })
  managed_policy_arns = [
    aws_iam_policy.get_s3_permission.arn,
  ]
}

resource "aws_iam_policy" "get_s3_permission" {
  name = "SENG3011_${var.group_name}_get_s3_permission"

  policy = jsonencode(
    {
      "Version" : "2012-10-17",
      "Statement" : [
        {
          "Effect" : "Allow",
          "Action" : "s3:GetObject",
          "Resource" : "arn:aws:s3:::f12a-zulu-frontend-s3-bucket/*"
        }
      ]
  })
}
