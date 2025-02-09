# 🏆 Research Poster Evaluation System

## 📌 Overview  
This repository contains a system for **automating the evaluation and ranking of research posters** using machine learning, QR-based authentication, and a structured scoring system. It consists of three major components:

1. **Part_1 - Machine Learning for Poster Assignment**
2. **Master - QR Code-Based Scoring System (Frontend & Backend)**
3. **Part_3 - Poster Ranking Based on Judge Scores**

## 📂 GitHub Branches  
The project is structured into three branches, each focusing on a specific component:

### 🧠 Part 1 - Poster Assignment System (ML-Based)  
This branch automates **judge assignments to posters** based on expertise and availability using machine learning techniques.

#### Features:
- **Judge Email Verification** (`sendEmail.py`) – Sends verification codes to judges via email.
- **Expertise Extraction** (`similarity.py`) – Uses Google Scholar to fetch judge research expertise.
- **Poster Matching** (`assignment.py`) – Matches judges to posters using semantic similarity.
- **Dependencies:** `pandas`, `sentence-transformers`, `sklearn`, `scholarly`.

#### Execution:
```sh
python sendEmail.py  # Sends verification codes to judges
python similarity.py  # Extracts judge expertise
python assignment.py  # Assigns judges to posters
```

### 🔲 Part 2 - QR Code-Based Scoring System  
This branch implements the **frontend and backend** required for scoring posters using **QR codes**.

#### Features:
- **React.js Frontend**: Judges authenticate and submit scores.
- **QR Code Generation** (`generateQRcode.js`) – Generates unique QR codes for poster scoring pages.
- **Firebase Firestore Integration** (`uploadExcelToFirebase.js`) – Manages judge assignments and poster data.
- **PIN Authentication** – Judges use a PIN to verify identity before scoring.

#### Execution:
```sh
git clone https://github.com/your-repo/poster-scoring.git
cd poster-scoring
npm install
npm start  # Runs the React frontend
node generateQRcode.js  # Generates QR codes
```

### 🏆 Part 3 - Poster Ranking System  
This branch processes **judges' scores** to fairly **rank research posters**.

#### Features:
- **Data Normalization & Handling Missing Scores** – Uses Z-score standardization.
- **Final Score Calculation** – Computes rankings based on adjusted scores.
- **Output Storage** – Saves ranked results to `poster_rankings.xlsx`.
- **Dependencies:** `pandas`, `numpy`, `scipy`, `openpyxl`.

#### Execution:
```sh
python ranking.py  # Processes judge scores and ranks posters
```

### 📡 Technologies Used  
- **React.js (Frontend UI)**  
- **Firebase Firestore (Database)**  
- **Python (Machine Learning, Ranking Algorithms)**  
- **QR Code Generator (`qrcode` package)**  
- **Excel Processing (`xlsx` package)**  

## 📝 License  
This project is licensed under the **MIT License**.  

