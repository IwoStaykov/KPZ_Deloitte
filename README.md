# KPZ_Deloitte – Aplikacja do zarządzania promptami
Hakerzy nie kodują, piszą prompty.
Aplikacja umożliwia tworzenie, wersjonowanie i współdzielenie promptów w środowisku chmurowym. Projekt został zbudowany z wykorzystaniem React + Vite oraz AWS Amplify, co zapewnia skalowalność i łatwość wdrożenia.

## 📦 Technologie
Frontend: React + Vite + TypeScript

Backend: AWS Amplify (Cognito, AppSync, DynamoDB)

Hosting: AWS Amplify Hosting

Zarządzanie stanem: React Context API

## 🚀 Funkcje
✅ Tworzenie i edycja promptów

📜 Historia wersji z możliwością porównania zmian

👥 Współdzielenie promptów z innymi użytkownikami

🔐 Autoryzacja i uwierzytelnianie przez Amazon Cognito

☁️ Wdrożenie w chmurze AWS Amplify

## 🛠️ Instalacja i uruchomienie lokalne
Klonowanie repozytorium:
```
git clone https://github.com/IwoStaykov/KPZ_Deloitte.git
cd KPZ_Deloitte
```

Instalacja zależności:
```
npm install
```

Uruchomienie aplikacji:
```
npm run dev
```

Aplikacja będzie dostępna pod adresem: http://localhost:5173

## 🌐 Wdrożenie w chmurze (AWS Amplify)
Projekt jest zintegrowany z AWS Amplify, co umożliwia łatwe wdrożenie i skalowanie aplikacji. Plik amplify.yml zawiera konfigurację procesu CI/CD.

Aby wdrożyć aplikację:

Zaloguj się do AWS Amplify Console.

Połącz repozytorium GitHub i wybierz gałąź dev.

Amplify automatycznie zbuduje i wdroży aplikację.

## 📁 Struktura projektu
```csharp

KPZ_Deloitte/
├── amplify/            # Konfiguracja AWS Amplify
├── public/             # Pliki statyczne
├── src/                # Kod źródłowy aplikacji
│   ├── components/     # Komponenty React
│   ├── pages/          # Strony aplikacji
│   ├── types/          # Definicje typów TypeScript
│   └── App.tsx         # Główny komponent aplikacji
├── amplify.yml         # Konfiguracja Amplify CI/CD
├── package.json        # Zależności projektu
└── README.md           # Dokumentacja projektu
```

## 🤝 Struktura repozytorium i zasady pracy

W naszym repozytorium przyjęliśmy uporządkowany model pracy z gałęziami, oparty na podejściu Git Flow. Dzięki temu łatwiej nam rozwijać aplikację, testować nowe funkcjonalności i utrzymywać stabilność na głównej gałęzi produkcyjnej.

### 📌 Gałęzie główne
* main

Główna gałąź produkcyjna. Trafia tu wyłącznie stabilny, przetestowany kod.

Zmiany mogą być integrowane z main tylko za pomocą pull requestów z dev.

* dev

Gałąź integracyjna, na której testujemy nowe funkcje. To tu trafiają wszystkie zakończone funkcjonalności zanim zostaną wypuszczone na produkcję.

### 🌱 Gałęzie robocze
* feature/nazwa-funkcji

Nowe funkcjonalności są rozwijane na osobnych gałęziach zaczynających się od feature/, które odchodzą od dev.

Po zakończeniu pracy i zmergowaniu do dev, gałąź może zostać usunięta.

* fix/nazwa-poprawki

Gałęzie szybkich poprawek dla main, jeśli mimo procesu testowania wystąpił błąd na środowisku produkcyjnym.

Te gałęzie również powinny być jak najszybciej integrowane i usuwane po zakończeniu prac.
