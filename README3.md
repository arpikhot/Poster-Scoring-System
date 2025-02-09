Poster Ranking System

#### Overview

This script (ranking.py) processes judges' scores to fairly rank research posters. The ranking process involves data normalization and handling of missing values to ensure fairness and consistency in evaluation.

#### Features

Reads judges' scores from an Excel file.
Handles missing scores (treats 0s as missing values and replaces them with the column mean).
Normalizes scores using Z-score standardization.
Computes final rankings based on adjusted scores.
Saves the ranked results into an Excel file.

#### Files

`ranking.py`: Main script for ranking posters.
`judge_scores.xlsx`: Input file containing judges' scores.
`poster_rankings2.xlsx`: Output file containing ranked posters.

#### Dependencies

Ensure you have the required Python libraries installed:
pip install pandas numpy scipy openpyxl

#### How It Works
Read Scores: Loads judges' scores from an Excel file.
Preprocessing:
Treats zeros as missing values.
Normalizes each judge’s scores using Z-score standardization.
Fills missing values with the column mean.
Ranking Algorithm:
Computes the final score by averaging the normalized scores.
Sorts posters based on the final score in descending order.
Assigns ranks accordingly.
Save Output: Saves the results to an Excel file.
Usage
Run the script with the appropriate input and output file paths:
`python ranking.py`
Or modify the script to specify your input and output files:
`input_file = "judge_scores_1.xlsx"`  # Replace with actual file path
`output_file = "poster_rankings.xlsx"`
`main(input_file, output_file)`

### Expected Output
`poster_rankings2.xlsx` will contain the ranked list of posters with their final scores and ranks.

Customization
Modify the normalization method in preprocess_scores() if needed.
Change the ranking criteria in rank_posters() to use different aggregation methods (e.g., median instead of mean).

