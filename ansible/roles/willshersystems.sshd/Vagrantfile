
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|

  config.vm.synced_folder ".", "/vagrant", type: "nfs"

  config.vm.define "ubuntu" do |ubuntu|
    ubuntu.vm.box = "boxcutter/ubuntu1604"
  #  ubuntu.vm.provision "shell", inline: <<-SHELL
  #    sudo add-apt-repository -y ppa:ansible/ansible
  #    sudo apt-get update -qq
  #    sudo apt-get -qq install ansible
  #  SHELL
  end

 config.vm.define "centos7" do |centos|
   centos.vm.box = "centos/7"

   centos.vm.provision "shell", inline: <<-SHELL
     sudo yum install -y libselinux-python
   SHELL
 end

  config.vm.provision "shell", inline: <<-SHELL
    test -e /vagrant/tests/roles/ansible-sshd || ln -s /vagrant /vagrant/tests/roles/ansible-sshd
  SHELL

  config.vm.provision "ansible_local" do |ansible|
#    ansible.config_file  = "tests/ansible.cfg"
    ansible.playbook = "tests/test.yml"
    ansible.install  = true
  end

end
