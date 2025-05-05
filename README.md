# KPZ_Deloitte – Aplikacja do zarządzania promptami
Hakerzy nie kodują, piszą prompty.
Aplikacja umożliwia tworzenie, wersjonowanie i współdzielenie promptów w środowisku chmurowym. Projekt został zbudowany z wykorzystaniem React + Vite oraz AWS Amplify, co zapewnia skalowalność i łatwość wdrożenia.

## 📦 Technologie
Frontend: React + Vite + TypeScript

Backend: AWS Amplify (Cognito, AppSync, DynamoDB)

Hosting: AWS Amplify Hosting

Zarządzanie stanem: React Context API

Stylizacja: CSS Modules / Tailwind CSS (jeśli używane)

## 🚀 Funkcje
✅ Tworzenie i edycja promptów

📜 Historia wersji z możliwością porównania zmian

👥 Współdzielenie promptów z innymi użytkownikami

🔐 Autoryzacja i uwierzytelnianie przez Amazon Cognito

☁️ Wdrożenie w chmurze AWS Amplify

## 🛠️ Instalacja i uruchomienie lokalne
Klonowanie repozytorium:

bash
Kopiuj
Edytuj
git clone https://github.com/IwoStaykov/KPZ_Deloitte.git
cd KPZ_Deloitte
Instalacja zależności:

bash
Kopiuj
Edytuj
npm install
Uruchomienie aplikacji:

bash
Kopiuj
Edytuj
npm run dev
Aplikacja będzie dostępna pod adresem: http://localhost:5173

## 🌐 Wdrożenie w chmurze (AWS Amplify)
Projekt jest zintegrowany z AWS Amplify, co umożliwia łatwe wdrożenie i skalowanie aplikacji. Plik amplify.yml zawiera konfigurację procesu CI/CD.

Aby wdrożyć aplikację:

Zaloguj się do AWS Amplify Console.

Połącz repozytorium GitHub i wybierz gałąź dev.

Amplify automatycznie zbuduje i wdroży aplikację.

## 📁 Struktura projektu

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