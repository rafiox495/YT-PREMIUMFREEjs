# 🎬 YouTube Premium Direct Downloader & Enhancer

> **Wielofunkcyjny UserScript dla Tampermonkey / Violentmonkey** — bezpośrednie pobieranie multimediów w najwyższej jakości z automatycznym tagowaniem ID3v2 i okładkami albumów, odtwarzanie w tle, blokowanie zbędnych elementów oraz natywny wygląd 1:1.

---

## ✨ Kluczowe Funkcje

* **🎵 Pobieranie MP3 i FLAC z metadanymi:** Wstrzykiwanie pełnych tagów **ID3v2.3** (wykonawca, tytuł, rok, album) wraz z miniaturyzacją okładki w wysokiej rozdzielczości (Cover Art) bezpośrednio do pliku w przeglądarce.
* **🎬 Pobieranie wideo MP4 (do 4K):** Błyskawiczny zapis materiałów wideo w najwyższej dostępnej jakości.
* **🛡️ Redundancja silników pobierania:** Podwójny backend API (Loader.to + multi-node Cobalt) gwarantujący niezawodność, gdy jeden z serwerów jest przeciążony.
* **🔇 Czysty interfejs i brak przerw:** Ukrywanie natrętnych banerów, powiadomień o subskrypcjach, promocji oraz automatyczne zamykanie monitów blokad.
* **🎧 Odtwarzanie w tle (Background Play):** Omijanie mechanizmów pauzowania odtwarzacza po przełączeniu karty lub zminimalizowaniu okna (`Page Visibility API spoofing`).
* **💎 Wygląd 1:1:** Wstrzykiwane wektorowe logo YouTube Premium oraz spójne wizualnie przyciski menu akcji.
* **⚡ Wysoka wydajność:** Zoptymalizowana obsługa DOM za pomocą `MutationObserver` z mechanizmem *debounce*, brak dławienia wątku głównego i brak czarnych ekranów przy ładowaniu wideo.

---

## 🚀 Instalacja

1. Zainstaluj rozszerzenie do obsługi skryptów użytkownika w swojej przeglądarce:
   * [Tampermonkey](https://www.tampermonkey.net/) (rekomendowane)
   * [Violentmonkey](https://violentmonkey.github.io/)
2. Kliknij ikonę rozszerzenia i wybierz **Utwórz nowy skrypt** (Create a new script).
3. Wklej pełny kod z pliku `youtube-premium-downloader.user.js`.
4. Zapisz (`Ctrl + S`) i odśwież stronę YouTube.

---

## 🛠️ Obsługiwane Formaty

| Format | Jakość | Metadane / Tagi | Przeznaczenie |
| :--- | :--- | :---: | :--- |
| **MP3** | Do 320 kbps | ✅ ID3v2 + Okładka | Smartfony, odtwarzacze samochodowe, biblioteki offline |
| **FLAC** | Bezstratna | ❌ Surowy strumień | Sprzęt audiofilski, odsłuch studyjny |
| **MP4** | Do 2160p (4K) | — | Oglądanie offline w najwyższej ostrości |

---

## 📖 Sposób Użycia

Pobieranie można zainicjować na dwa wygodne sposoby:

1. **Przycisk na pasku akcji:** Pod odtwarzanym filmem (obok przycisku *Polub / Udostępnij*) znajduje się menu rozwijane **Pobierz**, z którego wybierzesz żądany format.
2. **Przycisk w odtwarzaczu:** W prawym dolnym rogu kontrolera wideo dostępna jest szybka ikona pobierania wywołująca okno wyboru.

Stan konwersji i zapisu pliku jest na bieżąco komunikowany za pomocą dyskretnych powiadomień *Toast* w dolnej części ekranu.

---

## ⚙️ Wymagane Uprawnienia (`@grant`)

Skrypt wymaga zestawu uprawnień UserScript do poprawnego działania w piaskownicy przeglądarki:

* `unsafeWindow` – bezpośrednia integracja z obiektem odtwarzacza YouTube (`movie_player`).
* `GM_xmlhttpRequest` – asynchroniczne pobieranie strumieni binarzy i okładek z zewnętrznych serwerów bez ograniczeń CORS.
* `GM_addStyle` – bezpieczne aplikowanie reguł stylów bez naruszania polityki `Trusted Types`.

---

## ⚖️ Licencja & Zastrzeżenie

Projekt udostępniany na licencji **MIT**. Narzędzie zostało stworzone wyłącznie w celach edukacyjnych i do użytku prywatnego (tworzenie kopii zapasowych legalnie dostępnych treści).
