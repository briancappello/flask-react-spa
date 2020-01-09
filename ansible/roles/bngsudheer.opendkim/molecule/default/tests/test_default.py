import os

import testinfra.utils.ansible_runner

testinfra_hosts = testinfra.utils.ansible_runner.AnsibleRunner(
    os.environ['MOLECULE_INVENTORY_FILE']).get_hosts('all')


def test_hosts_file(host):
    f = host.file('/etc/hosts')

    assert f.exists
    assert f.user == 'root'
    assert f.group == 'root'


def test_opendkim_is_installed(host):
    opendkim = host.package("opendkim")
    assert opendkim.is_installed


def test_default_key_exists(host):
    host.file("/etc/opendkim/keys/default.txt").exists
