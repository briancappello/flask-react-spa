# libguestfs scripts for local ansible development

Requires a KVM-enabled kernel, `libguestfs` and `virt-manager`. The current user on the host OS should also have a valid SSH key, so that the VM can be accessed without a password.

These scripts are tested on Arch however they should run on most any Linux (with perhaps slight modification, eg the `dest` path in the `run-<distro>.sh` scripts).

When choosing a static IP address to use, eg `192.168.XXX.YYY`, the `XXX` portion should match that of the default virtual bridge used by KVM, which typically would be `virbr0`:

```bash
$ ip addr show virbr0 | grep inet
```

This value can also be found in `virt-manager` under `Edit > Connection Details > Virtual Networks (tab)`.

Then, to build a new CentOS 7.3 image with a hostname of `centos73` and a static IP of `192.168.XXX.YYY`:

```bash
$ ./build-centos83.sh centos73 192.168.XXX.YYY

# to "install" and run it (first run only):
$ sudo ./run-centos73.sh centos73

# to access it (give it 30 seconds or so to finish booting up):
$ ssh root@192.168.XXX.YYY

# the image(s) can also be managed with a GUI by running virt-manager:
$ virt-manager
```

Finally, since the ansible playbooks require a domain name, one should add the IP to `/etc/hosts` like so (here I use the hostname as the domain for convenience):

```
# ...
192.168.XXX.YYY centos73.io
```
