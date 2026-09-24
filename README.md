# ARstone — Prezentacja Logo & Strona GitHub Pages

Nowoczesna, lekka i w pełni responsywna strona internetowa prezentująca logo marki **ARstone**, zaprojektowana i zoptymalizowana pod publikację w **GitHub Pages**.

Adres strony po wdrożeniu: **[https://jacetyh.github.io/arstone/](https://jacetyh.github.io/arstone/)**

---

## 🚀 Jak uruchomić GitHub Pages

Strona jest gotowa do natychmiastowego hostowania w GitHub Pages. Możesz użyć jednej z dwóch metod:

### Metoda 1: Domyślny mechanizm (GitHub Actions - zalecany)
W repozytorium przygotowany jest workflow `.github/workflows/deploy.yml`:
1. Przejdź na GitHubie do swojego repozytorium: `Settings` → `Pages`.
2. W sekcji **Build and deployment** > **Source** wybierz: **GitHub Actions**.
3. Po scaleniu (merge) do gałęzi `main`, strona zostanie automatycznie opublikowana pod adresem:
   `https://jacetyh.github.io/arstone/`

### Metoda 2: Klasyczny deployment z gałęzi
1. Przejdź do `Settings` → `Pages`.
2. W sekcji **Build and deployment** > **Source** wybierz: **Deploy from a branch**.
3. Wybierz gałąź `main` oraz folder `/ (root)` i kliknij **Save**.

---

## 🎨 Jak podmienić logo na własny plik graficzny

Jeśli posiadasz własny plik z gotowym logo (np. `logo.png`, `logo.svg` lub `logo.webp`):
1. Skopiuj swój plik do katalogu `assets/` (np. `assets/moje-logo.png`).
2. W pliku `index.html` zaktualizuj ścieżkę w sekcji `.logo-display`:
   ```html
   <img src="./assets/moje-logo.png" alt="ARstone Logo" class="logo-image" id="arstoneLogo">
   ```
3. Opcjonalnie zaktualizuj favikonę w `<link rel="icon" ...>` w sekcji `<head>`.

---

## 💻 Podgląd lokalny

Możesz uruchomić prosty serwer HTTP na swoim komputerze:

```bash
# Uruchomienie prostego serwera Python
python3 -m http.server 8080
```
Następnie otwórz w przeglądarce: [http://localhost:8080](http://localhost:8080)

---

## 📁 Struktura plików

```
arstone/
├── .github/
│   └── workflows/
│       └── deploy.yml      # Automatyczny deployment GitHub Actions do Pages
├── assets/
│   ├── favicon.svg         # Favikona strony
│   └── logo.svg            # Wektorowe logo ARstone
├── .nojekyll               # Wyłączenie parsowania Jekyll dla szybszego ładowania
├── index.html              # Główna strona HTML5
├── style.css               # Responsywny arkusz stylów (Dark/Light mode)
└── README.md               # Dokumentacja projektu
```