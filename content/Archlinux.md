- [ArchLinux](https://archlinux.org/)

## install
- https://wiki.archlinux.org/title/Installation_guide
- https://www.walian.co.uk/arch-install-with-secure-boot-btrfs-tpm2-luks-encryption-unified-kernel-images.html

```bash
# set keymap
loadkeys de

#fdisk /dev/sda  # mbr
gdisk /dev/sda  # gpt

mkfs.ext4 -L BOOT /dev/sda2
cryptsetup --type luks2 --cipher aes-xts-plain64 --key-size 512 --hash sha512 --use-random --verify-passphrase luksFormat /dev/sda3
cryptsetup luksOpen /dev/sda3 root
mkfs.btrfs -L root /dev/mapper/root

mount /dev/mapper/root /mnt && cd /mnt
btrfs subvolume create @home
btrfs subvolume create @root
btrfs subvolume create @log
btrfs subvolume create @tmp
btrfs subvolume create @pkg
btrfs subvolume create @snapshots
cd ~ && umount /mnt

mount -o relatime,space_cache=v2,compress=lzo,subvol=@root /dev/mapper/root /mnt
mkdir -p /mnt/{boot/efi,home,var/log,var/cache/pacman/pkg,btrfs,tmp}

mount -o relatime,space_cache=v2,ssd,compress=lzo,subvol=@log /dev/mapper/root /mnt/var/log
mount -o relatime,space_cache=v2,ssd,compress=lzo,subvol=@pkg /dev/mapper/root /mnt/var/cache/pacman/pkg/
mount -o relatime,space_cache=v2,ssd,compress=lzo,subvol=@tmp /dev/mapper/root /mnt/tmp
mount -o relatime,space_cache=v2,ssd,compress=lzo,subvol=@home /dev/mapper/root /mnt/home

mount /dev/sda1 /mnt/boot

# setup networking!!
pacman-key --refresh-keys
pacstrap -K /mnt base base-devel linux linux-firmware vi

genfstab -U /mnt >> /mnt/etc/fstab

arch-chroot /mnt

echo "KEYMAP=de" > /etc/vconsole.conf

ln -sf /usr/share/zoneinfo/Europe/Vienna /etc/localtime
echo "Europe/Vienna" > /etc/timezone
hwclock --systohc

sed -i '/de_AT.UTF-8 UTF-8/s/^#//g' /etc/locale.gen
locale-gen
echo 'LANG="de_AT.UTF-8"' > /etc/locale.conf

# Initramfs
vi /etc/mkinitcpio.conf
# HOOKS=(base udev autodetect modconf kms keyboard keymap consolefont block encrypt filesystems fsck)
mkinitcpio -P
pacman -S linux-firmware cryptsetup btrfs-progs

pacman -S grub os-prober efibootmgr
grub-install --recheck /dev/sda  # mbr
grub-install --target=x86_64-efi --efi-directory=/boot/efi --bootloader-id=grub  # gpt
grub-mkconfig -o /boot/grub/grub.cfg

pacman -S dhclient sudo

# for encryption eddid /etc/default/grub
#GRUB_CMDLINE_LINUX="cryptdevice=/dev/sdXn:root root=/dev/mapper/root quiet"


# user
passwd

# set user
useradd -m x4x
passwd x4x
usermod -a -G wheel,adm,floppy,audio,video x4x


echo "x4x-arch" > /etc/hostname
echo "127.0.0.1        localhost" >> /etc/hosts
echo "::1              localhost" >> /etc/hosts

# gui
# pacman -S mesa lshw xf86-video-intel lib32-vulkan-intel
pacman -S xorg
# https://wiki.archlinux.org/title/KDE
#pacman -S plasma kde-applications
pacman -S xterm plasma-meta # or more minimal: plasma-desktop
pacman -S sddm
systemctl enable sddm
pacman -S filelight

pacman -S btrfs-progs cryptsetup snapper
pacman -S networkmanager
pacman -S sudo man-db htop vi curl screen
pacman -S python3 python-pip
pacman -S device-mapper lvm2
pacman -S openssl openssl-1.1 pacman glibc mkinitcpio fuse2
pacman -S ntfs-3g
#sudo pacman -Rs mplayer
# Remove Orphaned (Unused) Packages
#sudo pacman -Rns $(pacman -Qdtq)
# Searching for Already Installed Packages
#pacman -Qs vlc
# Clean-Up Package Cache
sudo pacman -Sc

# set x11 keymap
localectl set-x11-keymap de

systemctl enable systemd-networkd
systemctl enable systemd-resolved systemd-timesyncd NetworkManager 
```

### swap
#### with ext4
```bash
sudo dd if=/dev/zero of=/swapfile bs=1M count=8192
sudo chmod 0600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo "/swapfile    none    swap    sw      0 0" >> /etc/fstab
```
#### [[btrfs#SWAP with btrfs]]
make sure swap is on the [[btrfs]] level not in the root subvolium or snapshots dont work!

## yay (AUR)
in manjaro it can be installed with pacman

- https://aur.archlinux.org/
- https://wiki.archlinux.org/title/Arch_User_Repository
```bash
pacman -S git go
mkdir ~/git && cd ~/git
git clone https://aur.archlinux.org/yay.git
cd yay/ && makepkg -si
yay --version
# install package
yay -S librewolf-bin
```

### develoment
```bash
sudo pacman -S sdl2 cmake gcc make libgl strace ltrace binutils gdb libtool automake autoconf aspell clang
```
### makepkg
- https://wiki.archlinux.org/title/Makepkg
for systems with less ram or CPU:
```bash
vi /etc/makepkg.conf
```
set:
- `MAKEFLAGS="-j2"`
- `CFLAGS`  set `-O2 -march=native`

### rustc (optional)
optimize [[Rust_language]] so yay doesn't run out of memory.
- https://doc.rust-lang.org/cargo/reference/config.html
in `~/.cargo/config`
```toml
[build]
jobs = 1
rustflags = ["-C", "target-cpu=native", "-C", "opt-level=3"]
```
## snapper
- https://wiki.archlinux.org/title/Snapper
- https://man.archlinux.org/man/extra/snap-pac/snap-pac.8.en
- http://snapper.io/faq.html
```bash
pacman -S snapper snap-pac
# snap-pac is a hook that creates a snapshot everytime pacman is run

#snapper -c root create-config /
sudo snapper -c root create-config -f btrfs /
pacman
snapper -c root list
sudo snapper list-configs
sudo snapper --config root list

# list transaction canges
snapper -c root list -t pre-post
snapper -c root status 1..2
snapper -c root undochange 1..2

# create snapschot
snapper -c root create

# delete
sudo snapper --config root delete 1-10
```

## fonts
```bash
pacman -S noto-fonts noto-fonts-cjk

# or
sudo yay -S ttf-arphic-extra  
sudo pacman -S noto-fonts
sudo pacman -S ttf-arimo-nerd
```

## tools
```bash
sudo pacman -S xclip cronie
sudo pacman -S networkmanager-openconnect networkmanager-openvpn networkmanager-pptp network-manager-sstp
sudo pacman -S wireguard-tools
sudo pacman -S neofetch
```

## speech
- https://wiki.archlinux.org/title/Speech_dispatcher
- https://wiki.archlinux.org/title/Festival
```bash
sudo pacman -S speech-dispatcher espeakup festival
spd-conf
```
## real HW
```bash
pacman -S usbutils nmap openbsd-netcat wget ansible gdu firefox

```

