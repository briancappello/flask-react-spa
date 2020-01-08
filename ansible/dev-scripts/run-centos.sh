#!/bin/bash

# ./run-centos.sh vm_name

vm_name="$1"
vm_image="$vm_name.img"
dest="/var/lib/libvirt/images/$vm_image"
mv "$vm_image" "$dest"
chown nobody:kvm "$dest"

echo "running virt-install"
virt-install --import --name "$vm_name" \
	--ram 2048 \
	--disk path="$dest" \
	--os-variant rhel7.7 \
	--noautoconsole
