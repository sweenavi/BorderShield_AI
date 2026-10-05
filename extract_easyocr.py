import easyocr
import cv2
import json
import re

print("Loading EasyOCR model...")
reader = easyocr.Reader(['en'])

print("Reading image...")
results = reader.readtext('public/map.png')

nodes = []
pattern = re.compile(r'\b([LCHRBJ][P|T|R]?\d{2})\b')

print("Extracting nodes...")
for (bbox, text, prob) in results:
    match = pattern.search(text)
    if match:
        id_str = match.group(1)
        # bbox is a list of 4 points: [top-left, top-right, bottom-right, bottom-left]
        tl = bbox[0]
        br = bbox[2]
        cx = int((tl[0] + br[0]) / 2)
        cy = int((tl[1] + br[1]) / 2)
        
        # Assume the actual marker is a bit to the left or right? 
        # Usually text is next to the marker.
        nodes.append({
            "id": id_str,
            "text": text,
            "x": cx,
            "y": cy,
            "prob": prob
        })

print(f"Found {len(nodes)} nodes.")
with open('easyocr_nodes.json', 'w') as f:
    json.dump(nodes, f, indent=2)

print("Saved to easyocr_nodes.json")
