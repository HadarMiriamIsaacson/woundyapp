import pandas as pd
import re
import json


# Function to analyze individual test result based on reference range
def analyze_test(result, reference_range):
    try:
        result = float(result)
    except (ValueError, TypeError):
        return "Invalid result"

    # Extract range from the reference range (e.g., "4.1 - 5.1")
    match = re.search(r"(\d+\.?\d*)\s*-\s*(\d+\.?\d*)", reference_range)

    if match:
        min_val = float(match.group(1))
        max_val = float(match.group(2))

        if min_val <= result <= max_val:
            return "In-range"
        else:
            return "Out of range"

    return "Unknown range"


# Load the Excel file containing blood test results
def tests_analysis(file_path: str):
    data = pd.read_excel(file_path)

    # Analyze the blood test results
    analysis_results = []

    for index, row in data.iterrows():
        test_name = row["test"]  # Example 'Hemoglobin A1C'
        result = row["result"]  # Example '5.8' (actual test result)
        reference_range = row["reference range"]  # Example '4.1 - 5.1'

        # Only analyze rows with valid results and reference ranges
        if pd.notnull(result) and pd.notnull(reference_range):
            diagnosis = analyze_test(result, reference_range)
            analysis_results.append(
                {"Test": test_name, "Result": result, "Diagnosis": diagnosis}
            )

    # Convert the analysis results to JSON format
    json_output = json.dumps(analysis_results, indent=4)
    return json_output
