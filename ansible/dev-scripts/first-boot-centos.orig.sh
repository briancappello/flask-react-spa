#!/bin/bash

# configure static IP address
iface_name="$(ip addr show | egrep '[0-9]: [a-z0-9]+[0-9]:' | cut -d ' ' -f 2 | cut -d ':' -f 1)"
netconfig="/etc/sysconfig/network-scripts/ifcfg-$iface_name"
sed -i "s/dhcp/static/" $netconfig
echo "IPADDR=STATIC_IP" >> $netconfig
echo "NETMASK=255.255.255.0" >> $netconfig
echo "DNS1=8.8.8.8" >> $netconfig
echo "DNS2=8.8.4.4" >> $netconfig

echo "GATEWAY=GATEWAY_IP" >> /etc/sysconfig/network

# generate SSH keys
ssh-keygen -t rsa -P '' -f /etc/ssh/ssh_host_rsa_key
ssh-keygen -t ecdsa -P '' -f /etc/ssh/ssh_host_ecdsa_key
ssh-keygen -t ed25519 -P '' -f /etc/ssh/ssh_host_ed25519_key

# configure sshd
sshd_config="/etc/ssh/sshd_config"
sed -i 's/^#\?PermitRootLogin \(yes\|no\)/PermitRootLogin yes/' $sshd_config
sed -i 's/^#\?PubkeyAuthentication \(yes\|no\)/PubkeyAuthentication yes/' $sshd_config
sed -i 's/^#\?RSAAuthentication \(yes\|no\)/RSAAuthentication yes/' $sshd_config
sed -i 's/^PasswordAuthentication \(yes\|no\)/PasswordAuthentication no/' $sshd_config

# restart services
systemctl restart network
systemctl restart sshd
