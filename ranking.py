import pandas as pd
import numpy as np
from scipy.stats import zscore

def read_excel(file_path):
    """Reads the Excel file containing judges' scores."""
    return pd.read_excel(file_path, index_col=0)

def preprocess_scores(df):
    """Handles missing values (0s) and normalizes scores for fairness."""
    df.replace(0, np.nan, inplace=True)  # Treat 0 as missing
    df = df.apply(zscore, nan_policy='omit')  # Normalize scores per judge
    df.fillna(df.mean(), inplace=True)  # Fill missing values with column mean
    return df

def rank_posters(df):
    """Computes final poster rankings based on adjusted scores."""
    df['Final Score'] = df.mean(axis=1)  # Aggregate normalized scores
    ranked_posters = df[['Final Score']].sort_values(by='Final Score', ascending=False)
    ranked_posters['Rank'] = range(1, len(ranked_posters) + 1)
    return ranked_posters

def main(file_path, output_path):
    """Runs the ranking pipeline."""
    df = read_excel(file_path)
    processed_df = preprocess_scores(df)
    ranked_df = rank_posters(processed_df)
    ranked_df.to_excel(output_path)
    print("Ranking completed. Results saved to:", output_path)

# Example usage
if __name__ == "__main__":
    input_file = "judge_scores_1.xlsx"  # Replace with actual file path
    output_file = "poster_rankings2.xlsx"
    main(input_file, output_file)
