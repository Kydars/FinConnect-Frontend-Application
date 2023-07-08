variable "group_name" {
  type     = string
  nullable = false
  default  = ""
}

variable "global_s3_name" {
  type     = string
  nullable = false
  default  = ""
}

variable "gateway_api_id" {
  type     = string
  nullable = false
  default  = ""
}

variable "gateway_auth_id" {
  type     = string
  nullable = false
  default  = ""
}

variable "vpc_id" {
  type     = string
  nullable = false
  default  = ""
}

variable "vpc_connection_id" {
  type     = string
  nullable = false
  default  = ""
}

variable "new_relic_serverless_mode_enabled" {
  type     = string
  nullable = false
  default  = "true"
}

variable "new_relic_lambda_extension_enabled" {
  type     = string
  nullable = false
  default = "true"
}

variable "lambda_function_handler" {
  type     = string
  nullable = false
  default  = "handler.handler"
}

variable "new_relic_account_id" {
  type     = string
  nullable = false
  default  = "3860357"
}

variable "new_relic_license_key" {
  type     = string
  nullable = false
  default  = "b63b9cdb6c13f7cce9a09d0e449d2f6ebbadNRAL"
}

variable "new_relic_trusted_account_key" {
  type     = string
  nullable = false
  default = "3860357"
}

variable "new_relic_distributed_tracing_enabled" {
  type     = string
  nullable = false
  default  = "false"
}