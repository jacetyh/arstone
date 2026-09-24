# AR STONE — Wykończenia Wnętrz | Remonty | Kamień Dekoracyjny

Nowoczesna strona internetowa dla firmy **AR STONE** zoptymalizowana pod publikację w **GitHub Pages**.

Strona łączy:
- **Oficjalny branding AR STONE** z sygnetem cyrkla kreślarskiego, narzędzi i górskiego krajobrazu.
- **Wizytówkę pracowni i rzemiosła** w sekcji Hero z pełnym wyposażeniem warsztatu kamieniarskiego i remontowego.
- **Interaktywną animację HTML5**: stukanie młotkiem kamieniarskim w surową skałę z deszczem iskier na `<canvas>` i płynną transformacją w luksusowy blat marmurowy.
- **Dynamiczne portfolio realizacji**: podzielone na katalogi inwestycji ze zdjęciami.
- **Inteligentne sortowanie zdjęć**:
  - Zdjęcia ponumerowane (np. `1.jpg`, `2.png`, `3.webp`) są wyświetlane **w stałej kolejności rosnącej**.
  - Zdjęcia nienumerowane (np. `detal.jpg`, `front.png`) są wyświetlane **losowo** przy każdym otwarciu albumu.
- **Prosty system edycji treści**: centralny plik `content.json` pozwalający na łatwą zmianę tekstów, telefonów i adresów.

---

## ✏️ Jak w łatwy sposób zmieniać treści na stronie

Nie musisz edytować kodu HTML ani znać programowania! Wszystkie kluczowe teksty i dane kontaktowe znajdują się w jednym, przejrzystym pliku:

### 👉 **`content.json`**

Możesz go otworzyć w dowolnym edytorze tekstu (lub bezpośrednio na GitHubie klikając ikonę ołówka `Edit this file`):

```json
{
  "brand": {
    "name": "AR STONE",
    "tagline": "WYKOŃCZENIA WNĘTRZ | REMONTY | KAMIEŃ DEKORACYJNY",
    "badge": "Kompleksowe Wykończenia Wnętrz & Kamieniarstwo"
  },
  "hero": {
    "title_main": "Mistrzowskie Wykończenia Wnętrz &",
    "title_highlight": "Kamień Dekoracyjny",
    "description": "Tutaj wpisz swój opis firmy..."
  },
  "contact": {
    "phone": "+48 500 123 456",
    "email": "kontakt@arstone.pl",
    "address": "ul. Twoja Ulica 12, Twoje Miasto",
    "hours": "Poniedziałek – Piątek: 8:00 – 18:00",
    "response_time": "Odpowiadamy zwykle w ciągu 24 godzin"
  }
}
```
Zapisz plik, zrób commit/push i strona automatycznie zaktualizuje się o nowe dane!

---

## 📸 Jak dodawać nowe zdjęcia z wykonanych inwestycji

1. **Utwórz nowy folder w katalogu `projects/`**, np.:
   ```
   projects/05-rezydencja-sopot-schody-marmur/
   ```
2. **Wrzuć zdjęcia do tego folderu**:
   - **Kolejność numeryczna:** nazwij zdjęcia liczbami: `1.jpg`, `2.jpg`, `3.png` itp.
   - **Kolejność losowa:** nazwij zdjęcia dowolnie: `detal.jpg`, `kuchnia.png` — strona wymiesza je losowo.
3. *(Opcjonalnie)* Dodaj w folderze plik `info.json` z tytułem i kategorią inwestycji:
   ```json
   {
     "title": "Schody Pałacowe — Marmur Carrara",
     "category": "Schody & Posadzki",
     "description": "Klasyczne schody zabiegowe z profilowanym noskiem i podświetleniem.",
     "location": "Sopot, Polska"
   }
   ```
4. **Wyślij zmiany (git push):** GitHub Actions automatycznie zindeksuje nowy folder i opublikuje go w galerii!

---

## 💻 Podgląd lokalny

```bash
# Wygenerowanie indeksu projektów ze zdjęć
python3 generate_projects.py

# Uruchomienie lokalnego serwera
python3 -m http.server 8080
```
Otwórz w przeglądarce: [http://localhost:8080](http://localhost:8080)

---

---

## ⚡ Optymalizacja wydajności (Ultra-Fast Loading)

Strona została zoptymalizowana pod kątem maksymalnej szybkości wczytywania (Core Web Vitals):
- **Format WebP**: Grafiki zostały skompresowane do ultralekkich plików `.webp` (`workshop-hero.webp` waży zaledwie ~260 kB zamiast 7.8 MB, a `logo-official.webp` jedyne 37 kB!).
- **Spadek rozmiaru o ponad 95%**: Łączna waga strony spadła z niemal 16 MB do około 300 kB (ponad 50× szybsze ładowanie na telefonach i słabszym łączu).
- **Dyrektywa Preload**: Pliki krytyczne dla pierwszego wyrenderowania ekranu są pobierane z priorytetem `fetchpriority="high"`.

---

## 📁 Struktura plików

```
arstone/
├── assets/
│   ├── workshop-hero.webp    # Zoptymalizowane tło Hero (~260 kB)
│   ├── logo-official.webp    # Zoptymalizowane logo (~37 kB)
│   ├── workshop-hero.png     # Fallback PNG
│   ├── logo-official.png     # Fallback PNG
│   └── favicon.svg           # Favikona
├── content.json              # Centralny plik konfiguracji treści (teksty, telefony, adresy)
├── projects/                 # Katalogi inwestycji ze zdjęciami
├── app.js                    # Silnik JS: wczytywanie treści, animacja młotka, lightbox
├── index.html                # Główny szablon strony
├── style.css                 # Style strony i responsywność
├── generate_projects.py      # Automatyczny generator indeksu zdjęć
└── .github/workflows/deploy.yml
```