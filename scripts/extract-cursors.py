from PIL import Image
import os

src = r"C:\Users\John Amorim\Downloads\pixel-cursors-icon-set\43032.jpg"
out_dir = r"c:\Users\John Amorim\Documents\Projetos\John Projetos\Johnviti-v2\public\cursors"
os.makedirs(out_dir, exist_ok=True)

im = Image.open(src).convert("RGBA")
w, h = im.size
cell_w, cell_h = w // 2, h // 2

regions = {
    "pixel-arrow": (0, 0, cell_w, cell_h),
    "pixel-hand": (cell_w, 0, w, cell_h),
}


def process_crop(box, name, target=32):
    crop = im.crop(box)
    px = crop.load()
    cw, ch = crop.size

    min_x, min_y, max_x, max_y = cw, ch, 0, 0
    for y in range(ch):
        for x in range(cw):
            r, g, b, a = px[x, y]
            if r > 245 and g > 245 and b > 245:
                px[x, y] = (r, g, b, 0)
            elif a > 0:
                min_x = min(min_x, x)
                min_y = min(min_y, y)
                max_x = max(max_x, x)
                max_y = max(max_y, y)

    trimmed = crop.crop((min_x, min_y, max_x + 1, max_y + 1))
    tw, th = trimmed.size
    scale = target / max(tw, th)
    nw, nh = max(1, round(tw * scale)), max(1, round(th * scale))
    resized = trimmed.resize((nw, nh), Image.NEAREST)
    path = os.path.join(out_dir, f"{name}.png")
    resized.save(path)
    print(name, trimmed.size, "->", resized.size, path)


for name, box in regions.items():
    process_crop(box, name)
