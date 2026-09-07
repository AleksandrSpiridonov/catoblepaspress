from pathlib import Path
import sys

from PIL import Image, ImageEnhance


source = Path(sys.argv[1])
target = Path(sys.argv[2])

with Image.open(source) as opened:
    image = opened.convert("RGB")

# Restrained correction for a warm, slightly magenta portrait. These operations
# alter existing pixels only; no content generation, reconstruction, or retouch.
r, g, b = image.split()
r = r.point(lambda value: min(255, round(value * 0.985)))
g = g.point(lambda value: min(255, round(value * 1.012)))
b = b.point(lambda value: min(255, round(value * 1.008)))
image = Image.merge("RGB", (r, g, b))
image = ImageEnhance.Brightness(image).enhance(1.01)
image = ImageEnhance.Contrast(image).enhance(1.035)
image = ImageEnhance.Color(image).enhance(0.96)
image = ImageEnhance.Sharpness(image).enhance(1.06)

target.parent.mkdir(parents=True, exist_ok=True)
image.save(target, "WEBP", quality=70, method=6, exif=b"", icc_profile=None)

print(f"{image.width}x{image.height}\t{target.stat().st_size} bytes\t{target}")
