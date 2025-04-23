# ChatGPT Bookmarks (React)

Rozszerzenie do przeglądarki Chrome, które umożliwia zapisywanie zakładek do konwersacji ChatGPT. Wersja przepisana w React z TypeScript.

## Funkcje

- Zapisywanie zakładek do konwersacji ChatGPT w folderach
- Panel boczny z zakładkami dostępny na stronie ChatGPT
- Synchronizacja zakładek przez chrome.storage.sync
- Łatwe zarządzanie folderami i zakładkami

## Technologie

- React 19
- TypeScript
- Vite
- Chrome Extension API

## Rozwój

### Wymagania

- Node.js (zalecana wersja 18+)
- npm (zalecana wersja 8+)

### Instalacja zależności

```bash
npm install
```

### Uruchomienie w trybie deweloperskim

```bash
npm run dev
```

### Budowanie rozszerzenia

```bash
npm run build:extension
```

To polecenie zbuduje rozszerzenie i skopiuje wszystkie niezbędne pliki do katalogu `dist`.

## Instalacja rozszerzenia

1. Zbuduj rozszerzenie poleceniem `npm run build:extension`
2. Otwórz Chrome i przejdź do strony `chrome://extensions`
3. Włącz "Tryb dewelopera" (przełącznik w prawym górnym rogu)
4. Kliknij "Załaduj rozpakowane" i wybierz katalog `dist` z projektu
5. Rozszerzenie powinno pojawić się na liście zainstalowanych rozszerzeń

## Użycie

- Otwórz ChatGPT (https://chat.openai.com/)
- W lewym panelu bocznym ChatGPT pojawi się nowy przycisk z gwiazdką
- Kliknij gwiazdkę, aby otworzyć panel boczny z zakładkami
- Możesz tworzyć foldery i dodawać do nich zakładki
- Możesz również kliknąć ikonę rozszerzenia w pasku narzędzi Chrome, aby zarządzać zakładkami

## Licencja

MIT
