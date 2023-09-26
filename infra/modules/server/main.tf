terraform {
  required_providers {
    ncloud = {
      source = "NaverCloudPlatform/ncloud"
    }
  }
  required_version = ">= 0.13"
}

// Configure the ncloud provider
provider "ncloud" {
  access_key = var.NCP_ACCESS_KEY
  secret_key = var.NCP_SECRET_KEY
  region = "KR"
  site = "PUBLIC"
  support_vpc = true
}

resource "ncloud_login_key" "loginkey" {
  key_name = "wellplay-${var.env}-key"
}

// create server instance
resource "ncloud_server" "main" {
  subnet_no                 = var.subnet_no
  name                      = "wellplay-${var.name}-${var.env}"
  server_image_product_code = var.server_image_product_code
  server_product_code = var.product_code
  login_key_name            = ncloud_login_key.loginkey.key_name
  init_script_no = ncloud_init_script.main.init_script_no
  network_interface {
    network_interface_no = ncloud_network_interface.main.id
    order = 0
  }
}

// create init script
resource "ncloud_init_script" "main" {
  name    = "set-${var.name}-${var.env}"
  content = templatefile(
    "${path.module}/${var.init_script_path}",
    var.init_script_envs
  )
}

// vpc data
data "ncloud_vpc" "vpc" {
  id = var.vpc_no
}

// create acg
resource "ncloud_access_control_group" "main" {
  name        = "${var.name}-acg-${var.env}"
  vpc_no      = data.ncloud_vpc.vpc.vpc_no
}

resource "ncloud_access_control_group_rule" "main" {
  access_control_group_no = ncloud_access_control_group.main.id

  inbound {
    protocol    = "TCP"
    ip_block    = "0.0.0.0/0"
    port_range  =  var.acg_port_range
    description = "accept ${var.acg_port_range} port for ${var.name}"
  }
}

// create network interface for apply acg
resource "ncloud_network_interface" "main" {
    name                  = "${var.name}-nic-${var.env}"
    subnet_no             = var.subnet_no
    access_control_groups = [
        data.ncloud_vpc.vpc.default_access_control_group_no,
        ncloud_access_control_group.main.id
    ]
}
