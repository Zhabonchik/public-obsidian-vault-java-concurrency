- https://wiki.archlinux.org/title/Btrfs

```bash
# help
btrfs help

# get status
btrfs fi show
btrfs filesystem show 

# device statistic
sudo btrfs device stats /dev/mapper/sdc_crypt

# disk usage
sudo btrfs filesystem df /sharedfolders/docker

# reblanace
btrfs balance start /
btrfs balance status /

# subvoliums
btrfs subvolume list /
btrfs subvolume create  
btrfs subvolume snapshot
btrfs subvolume delete 
```

## resize
```bash
btrfs filesystem resize max /mnt
```

#### SWAP with btrfs
```bash
cd /
btrfs filesystem mkswapfile --size 2G /btrfs/swapfile
swapon /btrfs/swapfile
sudo sh -c 'echo "/btrfs/swapfile    none    swap    sw      0 0" >> /etc/fstab'
```
