"""Generate responsive WebP images from the original photos.
Usage: python3 scripts/optimise-images.py <originals_dir>
Originals are the photos downloaded from the old Wix site (names ef4553_<id>.jpg).
"""
import sys, os
from PIL import Image, ImageOps
src = sys.argv[1]
out = os.path.join(os.path.dirname(__file__), '..', 'public', 'img')
os.makedirs(out, exist_ok=True)
# slug -> (original id prefix, widths)
PHOTOS = {
 'hero-hall':        ('cd1b2d', [640, 1024, 1600, 2400]),
 'crowd-bavarian-flag': ('1306ab', [480, 800, 1200]),
 'schnitzel-burger-stein': ('1833a7', [480, 720]),
 'seafood-burger':   ('2cbb24', [480, 800, 1200]),
 'halloumi-salad':   ('4de7f8', [480, 800, 1200]),
 'toast-long-table': ('589762', [480, 600]),
 'bartender-tap':    ('5f4ee9', [480, 800, 1200]),
 'tap-tower':        ('634b38', [480, 800]),
 'hall-patrons':     ('66d1b0', [480, 800, 1200]),
 'sausage-platter':  ('6d3571', [480, 800, 1200]),
 'beef-burger':      ('76d41c', [480, 800, 1200]),
 'schnitzel-plate':  ('887ead', [480, 800, 1200]),
 'litre-steins-group': ('a5dfff', [480, 720]),
 'chalk-eternal-fame': ('18283b', [480, 800, 1200]),
 'chalk-bad-beer':   ('ea1c76', [480, 800, 1200]),
 'bbq-platter':      ('defc50', [480, 800, 1200]),
 'pulled-pork-burger': ('e56613', [480, 800, 1200]),
 'bavarian-platter': ('ec114d', [480, 800, 1200]),
}
files = os.listdir(src)
def find(p): return os.path.join(src, next(f for f in files if f.startswith('ef4553_'+p)))
for slug, (pid, widths) in PHOTOS.items():
    im = ImageOps.exif_transpose(Image.open(find(pid))).convert('RGB')
    for w in widths:
        if w > im.width: w = im.width
        h = round(im.height * w / im.width)
        r = im.resize((w, h), Image.LANCZOS)
        r.save(os.path.join(out, f'{slug}-{w}.webp'), 'WEBP', quality=76, method=6)
    print(slug, im.size, widths)
# Open Graph image (1200x630 crop of the hall interior)
im = ImageOps.exif_transpose(Image.open(find('cd1b2d'))).convert('RGB')
w = im.width; h = round(w * 630 / 1200)
top = (im.height - h) // 2
im.crop((0, top, w, top + h)).resize((1200, 630), Image.LANCZOS).save(os.path.join(out, 'og-image.jpg'), quality=82, optimize=True)
# Logo: black script on white -> transparent PNG/WebP in two colours
lg = Image.open(find('ca37c2')).convert('L')
alpha = ImageOps.invert(lg)
bbox = alpha.point(lambda v: 255 if v > 40 else 0).getbbox()
pad = 6
bbox = (max(0,bbox[0]-pad), max(0,bbox[1]-pad), min(lg.width,bbox[2]+pad), min(lg.height,bbox[3]+pad))
alpha = alpha.crop(bbox)
for name, rgb in (('logo-dark', (29,36,31)), ('logo-cream', (245,236,218))):
    base = Image.new('RGBA', alpha.size, rgb + (0,)); base.putalpha(alpha)
    for w in (240, 480):
        r = base.resize((w, round(base.height*w/base.width)), Image.LANCZOS)
        r.save(os.path.join(out, f'{name}-{w}.webp'), 'WEBP', quality=90, method=6)
# Favicon / app icon: the 'M' of the logo on deep green
mw = int(alpha.width * 0.56)
m = alpha.crop((0, 0, mw, alpha.height))
mb = m.point(lambda v: 255 if v > 40 else 0).getbbox(); m = m.crop(mb)
for size, fn in ((512,'icon-512.png'), (192,'icon-192.png'), (180,'apple-touch-icon.png'), (32,'favicon-32.png')):
    cv = Image.new('RGB', (size, size), (29,58,47))
    s = int(size*0.68); sc = min(s/m.width, s/m.height)
    mm = m.resize((max(1,int(m.width*sc)), max(1,int(m.height*sc))), Image.LANCZOS)
    cream = Image.new('RGB', mm.size, (245,236,218))
    cv.paste(cream, ((size-mm.width)//2, (size-mm.height)//2), mm)
    cv.save(os.path.join(out, fn), optimize=True)
