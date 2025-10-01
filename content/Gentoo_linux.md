 https://www.gentoo.org/
- https://wiki.gentoo.org/wiki/Main_Page

Gentoo installs everything from source (except new bin repo!).
It uses the source code and the building instruction Ebuild.
the **[gentoolkit](https://wiki.gentoo.org/wiki/Gentoolkit)** contains helpful tools e.g.
```bash
# euse get mening of useflag
euse -i gpm
# enable flag
euse -E gpm
# disable flag
euse -D gpm

# switch of X11 suport for package
flaggie app-editors/vim -X

# show architecture compatibility and version info
eshowkw cups

# get more info about ebuild
equery

# unmask package for compilation
flaggie app-editors/vim +~amd64
```

[eix](https://wiki.gentoo.org/wiki/Eix) is a tool to help with searching the ebuild repository.

## install
install not from Gentoo live image but from another distro with GUI!

1) boot from any linux cd.
2) create fielsystem and partitions like in [[Archlinux]] install. Be sure if using GPT or MBR!!
3) mount disks to `/mnt/gentoo`
4) `cd /mnt/gentoo/`
5) `wget https://distfiles.gentoo.org/releases/amd64/autobuilds/20231224T164659Z/stage3-amd64-desktop-openrc-20231224T164659Z.tar.xz` get the stage 3 tar.xz
6) `tar xpvf stage3-*.tar.xz --xattrs-include='*.*' --numeric-owner` extract arcive
7) compile options `nano /mnt/gentoo/etc/portage/make.conf`
	- check `COMMON_FLAGS="-march=native -O2 -pipe"`
	- if not all cores change: `MAKEOPTS="-j4 -l5"`
	- add `RUSTFLAGS="${RUSTFLAGS} -C target-cpu=native"`
	- Links: 
	  - https://gcc.gnu.org/onlinedocs/
	  - https://wiki.gentoo.org/wiki//etc/portage/make.conf
	  - https://github.com/MentalOutlaw/deploygentoo/blob/master/gentoo/portage/make.conf
8) select portage mirrors
	add `GENTOO_MIRRORS="https://ftp.snt.utwente.nl/pub/os/linux/gentoo/"` in `etc/portage/make.conf`
9) ~~Gentoo ebuild repository~~
	  `cp /mnt/gentoo/usr/share/portage/config/repos.conf /mnt/gentoo/etc/portage/repos.conf/gentoo.conf`
10) copy DNS: `cp --dereference /etc/resolv.conf /mnt/gentoo/etc/`
11) mounting file systems:
```bash
mount --types proc /proc /mnt/gentoo/proc
mount --rbind /sys /mnt/gentoo/sys
mount --make-rslave /mnt/gentoo/sys
mount --rbind /dev /mnt/gentoo/dev
mount --make-rslave /mnt/gentoo/dev
mount --bind /run /mnt/gentoo/run
mount --make-slave /mnt/gentoo/run

chroot /mnt/gentoo /bin/bash
source /etc/profile
export PS1="(chroot) ${PS1}"
```
11) (optional, if low ram) create swap
12) install ebuild repository: ```emerge-webrsync```
13) (optional) update rep: ```emerge --sync```
14) (optional) Reading news items:
	1)```eselect news list
	eselect news read 1 | less```
15) Choosing the right profile 
	1) this selects the @World packages (`emerge --info`)
	2) `eselect profile list` and  `eselect profile set 27` or the one you want.
16) set additional USE items (optional)
	1) copy the USE variable to the make.conf `emerge --info | grep ^USE`
	2) to remove a item you need to add a `-` in front.
	3) ```USE="X a52 aac acl acpi activities alsa amd64 bluetooth branding bzip2 cairo cdda cdr cet crypt cups dbus declarative dri dts dvd dvdr elogind encode exif flac gdbm gif gpm gui iconv icu ipv6 jpeg kde kwallet lcms libnotify libtirpc lzma mad mng mp3 mp4 mpeg multilib ncurses networkmanager nls ogg opengl openmp pam pango pcre pdf pipewire plasma png policykit ppds pulseaudio qml qt5 readline screencast sdl seccomp semantic-desktop sound spell ssl startup-notification svg tcpd test-rust tiff truetype udev udisks unicode upower usb vorbis vulkan wayland widgets wxwidgets x264 xattr xcb xft xml xv xvid zlib zstd"```
17) ACCEPT_LICENSE variable: `ACCEPT_LICENSE="*"` in make.conf
18) update: `emerge --ask --verbose --update --deep --newuse @world`
19) (otional) install other editor:  `emerge -p app-editors/vim`
20) time zone: `echo "Europe/Vienna" > /etc/timezone`
21) `emerge --config sys-libs/timezone-data`
22) Locale generation: `echo "de_AT.UTF-8 UTF-8" >> /etc/locale.gen`
23) `locale-gen`
24) check locale: `eselect locale list`
25) select now locale: `eselect locale set 4`
26) ```env-update && source /etc/profile && export PS1="(chroot) ${PS1}"```
27) create [/etc/portage/package.license](https://wiki.gentoo.org/wiki//etc/portage/package.license) 
28) [install kernal](https://wiki.gentoo.org/wiki/Handbook:X86/Installation/Kernel) (i use the binary hire):
	1) Linux Firmware:
		- `emerge --ask sys-kernel/linux-firmware`
	2) bootloader:
		- add `grub` to useflags
		- `emerge --ask sys-kernel/installkernel`
		- maybe you need to run `dispatch-conf`
	3) initramfs
		- add `dracut` to useflags
		- `emerge --ask sys-kernel/installkernel`
	4) get binary kernal
		- `emerge --ask sys-kernel/gentoo-kernel-bin`
		- or kernal from source `emerge --ask sys-kernel/gentoo-kernel`
		- ~~`emerge --autounmask-write gentoo-kernel-bin linux-firmware intel-microcode installkernel`~~
	5) kernal modules: `find /lib/modules/<kernel version>/ -type f -iname '*.o' -or -iname '*.ko' | less`
		1) but will be automaticly enabled by udev!
29) (optional) intel mircocodes: `emerge --ask sys-firmware/intel-microcode`. AMD is in firmware included.
30) check kernal install `eselect kernel list`
31) generate /etc/fstab
32) network config
33) hostname `echo gentoo > /etc/hostname`
34) hostsfile
35) `passwd`
36) install aditonal packages
	1) `emerge dhcpcd sudo screenfetch app-misc/screen gentoolkit app-misc/resolve-march-native` 
37) grub bootloader
	1) `grub-install /dev/sda`
	2) `grub-mkconfig -o /boot/grub/grub.cfg`
38) set sudoers: `EDITOR=nano visudo`
39) `useradd -m -G wheel,users,video,audio,usb -s /bin/bash x4x`
40) `passwd x4x`
41) `rm -rf stage3-amd64-*.tar.xz`
42) `systemctl enable --now dhcpcd`

### install desktop
```bash
emerge --autounmask-write --autounmask dev-util/xxdiff
emerge --ask app-text/wgetpaste
emerge app-portage/cfg-update
# check lua version in make.conf!
emerge kde-plasma/plasma-meta
emerge x11-misc/sddm
emerge gui-libs/display-manager-init
#rc-service display-manager start
rc-update add display-manager default
usermod -a -G video sddm
emerge media-libs/mesa
emerge x11-terms/xterm
emerge --autounmask-write --newuse x11-base/xorg-server

# set in make.conf
# INPUT_DEVICE="libinput"
# VIDEO_DEVICE="virtio vmware intel"
emerge --newuse x11-base/xorg-drivers
env-update
source /etc/profile

# todo
emerge kde-apps/dolphin
emerge kde-apps/konsole
emerge sys-apps/usbutils
#emerge --autounmask-write kde-apps/kde-apps-meta
emerge --autounmask-write kde-apps/kdecore-meta
```
### fixes
```bash
dispatch-conf  # fix emerge config problems

# update
emaint --auto sync
emerge --ask --verbose --update --deep --newuse @world

etc-update

# system update
emaint sync
emerge -uDU --keep-going --with-bdeps=y @world
#emerge -avuUD @world

# search package
emerge --search firefox
emerge --info firefox

# remove package
emerge -cev firefox
emerge --unmerge firefox
# remove with ignoring dependencys
emerge -C firefox

# dependensy problems
emerge --autounmask-write kde-apps/kde-apps-meta
emerge --autounmask-continue kde-apps/kde-apps-meta

# compile build to package
emerge --buildpkg firefox
PKGDIR=/mnt/cdrom/packages
emerge --usepkg firefox
```

### cpu flags
- https://wikitest.gentoo.org/wiki/CPU_FLAGS_X86
```bash
emerge app-portage/cpuid2cpuflags
cpuid2cpuflags
echo "*/* $(cpuid2cpuflags)" > /etc/portage/package.use/00cpu-flags
```
