# ARstone — Strona Kamieniarska & Portfolio Inwestycji

Nowoczesna strona internetowa dla pracowni kamieniarskiej **ARstone** zoptymalizowana pod publikację w **GitHub Pages**.

Strona zawiera:
- **Interaktywną animację HTML5**: stukanie młotkiem kamieniarskim w surową skałę z deszczem iskier i płynną transformacją w luksusowy, polerowany blat marmurowy z żyłkami Calacatta.
- **Dynamiczne portfolio realizacji**: podzielone na katalogi inwestycji ze zdjęciami.
- **Inteligentne sortowanie zdjęć**:
  - Zdjęcia ponumerowane (np. `1.jpg`, `2.png`, `3.webp`) są wyświetlane **w stałej kolejności rosnącej**.
  - Zdjęcia nienumerowane (np. `detal.jpg`, `front.png`) są wyświetlane **losowo** przy każdym otwarciu albumu.
- **Pełnoekranowy Lightbox**: przeglądanie galerii inwestycji z obsługą klawiatury (strzałki, Esc) oraz miniaturkami.
- **Zakładki tematyczne**: *O nas*, *Obróbka Kamienia*, *Realizacje*, *Materiały & Oferta*, *Kontakt & Wycena*.
- **Motyw Ciemny / Jasny** z zapamiętywaniem preferencji.

---

## 📸 Jak dodawać nowe zdjęcia z wykonanych inwestycji

Dodawanie nowych projektów jest w 100% bezobsługowe:

1. **Utwórz nowy folder w katalogu `projects/`**, np.:
   ```
   projects/05-rezydencja-sopot-schody-marmur/
   ```
2. **Wrzuć zdjęcia do tego folderu**:
   - **Jeśli chcesz określić kolejność zdjęć:** nazwij je liczbami: `1.jpg`, `2.jpg`, `3.png` itp. (z dowolnym rozszerzeniem `.jpg`, `.jpeg`, `.png`, `.webp`, `.svg`).
   - **Jeśli nie ponumerujesz zdjęć:** strona automatycznie wymiesza je i wyświetli w **losowej kolejności**.
3. *(Opcjonalnie)* Jeśli chcesz dodać własny opis lub zmienić kategorię, stwórz w tym folderze plik `info.json`:
   ```json
   {
     "title": "Schody Pałacowe — Marmur Carrara",
     "category": "Schody & Posadzki",
     "description": "Klasyczne schody zabiegowe z profilowanym noskiem i podświetleniem.",
     "location": "Sopot, Polska"
   }
   ```
   *Jeśli nie dodasz pliku `info.json`, strona sama wygeneruje czytelny tytuł z nazwy folderu.*

4. **Wyślij zmiany do repozytorium (git push):**
   GitHub Actions automatycznie przeskanuje nowy katalog, zindeksuje zdjęcia i opublikuje zaktualizowaną stronę na GitHub Pages!

---

## 💻 Podgląd lokalny

Możesz uruchomić stronę lokalnie w terminalu:

```bash
# Skanowanie i generowanie indeksu projektów
python3 generate_projects.py

# Uruchomienie lokalnego serwera
python3 -m http.server 8080
```
Otwórz w przeglądarce: [http://localhost:8080](http://localhost:8080)

---

## 📁 Struktura plików

```
arstone/
├── .github/workflows/
│   └── deploy.yml            # Automatyczne budowanie indeksu i wdrożenie na Pages
├── assets/
│   ├── favicon.svg           # Favikona sygnetu ARstone
│   └── logo.svg              # Wektorowe logo ARstone
├── projects/                 # KATALOGI Z WYKONANYMI INWESTYCJAMI
│   ├── 01-kuchnia-marmur-calacatta/           (zdjęcia 1.svg, 2.svg, 3.svg - kolejność 1,2,3)
│   ├── 02-lazienka-granit-nero-marquina/      (zdjęcia 1.svg, 2.svg - kolejność 1,2)
│   ├── 03-wyspa-kuchenna-kwarcyt-taj-mahal/   (zdjęcia nienumerowane - losowe)
│   └── 04-schody-lewitujace-granit-star-galaxy/
├── app.js                    # Silnik JS: animacja HTML5, cząsteczki, sortowanie, lightbox
├── generate_projects.py      # Automatyczny generator indeksu projektów (projects.json)
├── index.html                # Główny szablon HTML5 z sekcjami i sceną animacji
├── projects.json             # Wygenerowany rejestr inwestycji
├── style.css                 # Style CSS, motywy dark/light, responsywność
└── .nojekyll                 # Wyłączenie Jekylla na GitHub Pages
```