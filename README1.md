# Poster Assignment System

## Overview
This repository contains Python scripts designed to automate the assignment of judges to research posters based on expertise and availability. The scripts utilize machine learning models for semantic similarity and optimize the distribution of judges across posters.

## Files

### 1. `sendEmail.py`
This script generates verification codes for judges and sends them via email.

#### Note:
- `sender_email = "your-email@gmail.com"` Replace sender_email with your own email address.[Has to be a google account]
- `password = "your-app-password"` Replace password with your Gmail App Password.
- `judge_email = "judge_email@any.com"  #judge["Email"]` If judge Email column is not avaiable then use a common email in `judge_email@any.com` else use `judge[Email]`
- This script creates verification codes for judges and emails them.

#### Functionality:
- Loads judges.xlsx which contains judge email addresses.
- Generates a random 3-digit verification code for each judge.
- Sends an email to each judge with their verification code.
- Saves the updated list with verification codes in:
- `judge_with_code.xlsx`

Steps to Execute:
- Load `judges.xlsx`, ensuring it contains judge IDs which is 'Judge' and emails.
- Generate random 3-digit verification codes for each judge.
- Establish an SMTP connection and authenticate using Gmail App Password.
- Add main email id if judges email not available
- Send an email with the verification code to each judge.
- Save the updated judge list to `judge_with_code.xlsx`

Steps to set Gmail App password:
- Setting up Google App Password for Email Sending:
- Go to Google Account Security.
- Under the 'Signing in to Google' section, select 'App Passwords'.
- Sign in to your Google account if prompted.
- Under 'Select App', choose Mail, and under 'Select Device', choose Other (Custom name).
- Enter a name like Python Email Script and click Generate.
- Copy the generated 16-character password and use it in sendEmail.py as:
- sender_email = "your-email@gmail.com"
- password = "your-app-password"
- Ensure 2-Step Verification is enabled on your Google Account.
- Load judges.xlsx, ensuring it contains judge IDs and emails.
- Generate random 3-digit verification codes for each judge.
- Establish an SMTP connection and authenticate using Gmail App Password.
- Send an email with the verification code to each judge.
- Save the updated judge list to judge_with_code.xlsx.



### 2. `similarity.py`
This script extracts research interests, domains, and keywords of professors from Google Scholar using the scholarly library. It automates the process of fetching research profiles based on professor names listed in an Excel file. The extracted data is then saved to a CSV file for further analysis.

### Features:
- Reads professor names from an Excel file (judge_with_code.xlsx).
- Searches for each professor’s profile on Google Scholar.
- Extracts research interests, top 5 paper titles, and keywords.
- Saves the extracted data into professor_expertise.csv.

### Requirements
- Ensure you have the following Python libraries installed in Dependencies section

### Steps to Execute
Prepare the Excel file:

Ensure judge_with_code.xlsx contains professor names in the columns `"Judge FirstName"` and `"Judge LastName"`.
# Run the script:
python script.py

# Output:
The script will generate `professor_expertise.csv`, containing:
- `name`: Full name of the professor.
- `interests`: Research interests.
- `domains`: Titles of the professor’s top 5 papers.
- `keywords`: Extracted keywords from the research domains.
# Notes
The script includes a time.sleep(3) delay between requests to avoid getting blocked by Google Scholar.
If a professor does not have a Google Scholar profile, empty values will be recorded in the CSV.
Errors (e.g., network issues or missing profiles) will be logged in the console.


### 3. `assignment.py`
This script follows a similar process but is adapted for assigning professors to posters instead of judges.

#### Functionality:
- Loads datasets:
  - `professor_expertise.csv`: Contains professor names, interests, domains, and keywords.
  - `posters.xlsx`: Contains poster abstracts and topics.
  - `judge_with_code.xlsx`: Contains judge availability.
- Computes similarity between poster abstracts and professor expertise.
- Matches posters to professors based on:
  - Expertise alignment.
  - Availability constraints.
  - A maximum of six poster assignments per professor.
- Saves output to:
  - `updated_posters.xlsx`
  - `updated_judges_pin.xlsx`


## Dependencies
- `pandas`
- `sentence-transformers`
- `scikit-learn`
- `openpyxl`
- `collections`
- `sklearn`
- `smtplib`   --- should be included in python
- `email`     --- should be included in python
- `scholarly`


## Installation
To install the required dependencies for all directories, run:
```sh
pip install pandas sentence-transformers scikit-learn openpyxl collections sklearn smtplib email scholarly
```


## Usage
1. Ensure the necessary input files are available in the same directory.
2. Run the scripts:
   ```sh
   sendEmail.py
   python similarity.py
   python assignment.py
   ```
3. Check the generated output files for judge/poster assignments.

## Author
Developed for automating research poster evaluation assignments.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
