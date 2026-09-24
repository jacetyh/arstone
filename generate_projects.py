#!/usr/bin/env python3
"""
Generator indeksu projektów ARstone dla GitHub Pages.
Skanuje katalog 'projects/' i tworzy plik 'projects.json'.
Obsługuje sortowanie numeryczne dla ponumerowanych zdjęć (1.jpg, 2.jpg)
oraz oznacza pozostałe jako losowe.
"""

import os
import json
import re

PROJECTS_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "projects")
OUTPUT_JSON = os.path.join(os.path.dirname(os.path.abspath(__file__)), "projects.json")

IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp", ".svg", ".avif", ".gif"}

def extract_leading_number(filename):
    """Zwraca liczbę z nazwy pliku, jeśli istnieje, lub None."""
    name_without_ext = os.path.splitext(filename)[0]
    match = re.match(r"^(\d+)", name_without_ext)
    if match:
        return int(match.group(1))
    
    # Sprawdź dowolną liczbę w nazwie
    matches = re.findall(r"\d+", name_without_ext)
    if matches:
        return int(matches[0])
    return None

def clean_title(folder_name):
    """Przekształca nazwę katalogu na czytelny tytuł."""
    # Usuń wiodące numery i separatory np. '01-', '02_'
    title = re.sub(r"^\d+[-_ ]*", "", folder_name)
    title = title.replace("-", " ").replace("_", " ")
    return title.strip().title()

def scan_projects():
    if not os.path.exists(PROJECTS_DIR):
        os.makedirs(PROJECTS_DIR, exist_ok=True)
        return []

    projects = []
    # Pobierz katalogi
    entries = sorted(os.listdir(PROJECTS_DIR))
    
    for entry in entries:
        dir_path = os.path.join(PROJECTS_DIR, entry)
        if not os.path.isdir(dir_path):
            continue

        images = []
        info = {
            "id": entry,
            "title": clean_title(entry),
            "category": "Realizacje",
            "description": f"Projekt i wykonanie kamieniarskie: {clean_title(entry)}.",
            "location": "Polska",
            "date": ""
        }

        # Sprawdź opcjonalny plik info.json lub info.txt
        info_file = os.path.join(dir_path, "info.json")
        if os.path.isfile(info_file):
            try:
                with open(info_file, "r", encoding="utf-8") as f:
                    custom_info = json.load(f)
                    info.update(custom_info)
            except Exception as e:
                print(f"Ostrzeżenie: Błąd czytania {info_file}: {e}")

        # Przeszukaj pliki w folderze
        all_files = sorted(os.listdir(dir_path))
        is_numbered = True
        numbered_images = []
        regular_images = []

        for f in all_files:
            ext = os.path.splitext(f)[1].lower()
            if ext in IMAGE_EXTENSIONS:
                rel_path = f"projects/{entry}/{f}"
                num = extract_leading_number(f)
                if num is not None:
                    numbered_images.append((num, rel_path))
                else:
                    is_numbered = False
                    regular_images.append(rel_path)

        # Logika sortowania
        if is_numbered and numbered_images:
            # Wszystkie są ponumerowane -> sortuj według numeru
            numbered_images.sort(key=lambda x: x[0])
            images = [img[1] for img in numbered_images]
            is_random = False
        else:
            # Niektóre lub żadne nie są ponumerowane -> zachowaj z flagą do losowania
            images = [img[1] for img in numbered_images] + regular_images
            is_random = True

        if images:
            projects.append({
                "id": info["id"],
                "title": info["title"],
                "category": info.get("category", "Realizacje"),
                "description": info.get("description", ""),
                "location": info.get("location", ""),
                "is_random": is_random,
                "cover": images[0],
                "images": images
            })

    return projects

def main():
    projects = scan_projects()
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(projects, f, indent=2, ensure_ascii=False)
    print(f"Pomyślnie zindeksowano {len(projects)} projektów do {OUTPUT_JSON}")

if __name__ == "__main__":
    main()
