#!/usr/bin/env python3
"""Generate assets/icon.icns for the Eisenhower Matrix app."""
import struct, zlib, math, os, subprocess, shutil

# RGBA colors for the four quadrants
Q1 = (239, 68,  68,  255)   # red    – Urgent & Important
Q2 = (34,  197, 94,  255)   # green  – Important & Not Urgent
Q3 = (249, 115, 22,  255)   # orange – Urgent & Not Important
Q4 = (148, 163, 184, 255)   # slate  – Not Urgent & Not Important
WHITE = (255, 255, 255, 255)
TRANSPARENT = (0, 0, 0, 0)


def make_png(size: int) -> bytes:
    gap = max(2, size // 20)   # white divider thickness
    mid = size // 2
    r = size // 8              # corner radius

    def in_rounded_rect(x, y):
        if not (0 <= x < size and 0 <= y < size):
            return False
        # corner checks
        if x < r and y < r:
            return math.hypot(x - r, y - r) <= r
        if x >= size - r and y < r:
            return math.hypot(x - (size - r), y - r) <= r
        if x < r and y >= size - r:
            return math.hypot(x - r, y - (size - r)) <= r
        if x >= size - r and y >= size - r:
            return math.hypot(x - (size - r), y - (size - r)) <= r
        return True

    rows = []
    for y in range(size):
        row = bytearray()
        for x in range(size):
            if not in_rounded_rect(x, y):
                row.extend(TRANSPARENT)
            elif abs(x - mid) < gap // 2 + 1 or abs(y - mid) < gap // 2 + 1:
                row.extend(WHITE)
            elif x < mid and y < mid:
                row.extend(Q1)
            elif x >= mid and y < mid:
                row.extend(Q2)
            elif x < mid and y >= mid:
                row.extend(Q3)
            else:
                row.extend(Q4)
        rows.append(bytes(row))

    def chunk(name: bytes, data: bytes) -> bytes:
        c = name + data
        return struct.pack('>I', len(data)) + c + struct.pack('>I', zlib.crc32(c) & 0xFFFFFFFF)

    sig   = b'\x89PNG\r\n\x1a\n'
    ihdr  = chunk(b'IHDR', struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0))
    raw   = b''.join(b'\x00' + row for row in rows)
    idat  = chunk(b'IDAT', zlib.compress(raw, 9))
    iend  = chunk(b'IEND', b'')
    return sig + ihdr + idat + iend


# iconutil requires this exact folder/file naming
ICONSET_SIZES = [
    ('icon_16x16.png',       16),
    ('icon_16x16@2x.png',    32),
    ('icon_32x32.png',       32),
    ('icon_32x32@2x.png',    64),
    ('icon_128x128.png',    128),
    ('icon_128x128@2x.png', 256),
    ('icon_256x256.png',    256),
    ('icon_256x256@2x.png', 512),
    ('icon_512x512.png',    512),
    ('icon_512x512@2x.png',1024),
]

iconset_dir = 'assets/icon.iconset'
os.makedirs(iconset_dir, exist_ok=True)

print('Generating PNG sizes...')
for filename, size in ICONSET_SIZES:
    path = os.path.join(iconset_dir, filename)
    with open(path, 'wb') as f:
        f.write(make_png(size))
    print(f'  {filename} ({size}x{size})')

print('Running iconutil...')
subprocess.run(
    ['iconutil', '-c', 'icns', iconset_dir, '-o', 'assets/icon.icns'],
    check=True
)

shutil.rmtree(iconset_dir)
print('Done → assets/icon.icns')
