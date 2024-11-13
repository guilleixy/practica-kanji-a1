import json

# Load the existing data
with open('public/kanjis.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

# Add a key to each kanji
for i, kanji in enumerate(data):
    kanji['key'] = i

# Save the modified data
with open('kanjis.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)