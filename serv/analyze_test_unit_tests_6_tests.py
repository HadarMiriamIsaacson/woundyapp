
import unittest
import re

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


# Unit tests for analyze_test function
class TestAnalyzeTestFunction(unittest.TestCase):
    
    def test_valid_in_range(self):
        result = analyze_test(4.5, "4.1 - 5.1")
        self.assertEqual(result, "In-range")
    
    def test_valid_out_of_range(self):
        result = analyze_test(6.2, "4.1 - 5.1")
        self.assertEqual(result, "Out of range")
    
    def test_invalid_result_format(self):
        result = analyze_test("invalid", "4.1 - 5.1")
        self.assertEqual(result, "Invalid result")
    
    def test_unknown_range(self):
        result = analyze_test(4.5, "unknown")
        self.assertEqual(result, "Unknown range")
    
    def test_at_lower_bound(self):
        result = analyze_test(4.1, "4.1 - 5.1")
        self.assertEqual(result, "In-range")
    
    def test_at_upper_bound(self):
        result = analyze_test(5.1, "4.1 - 5.1")
        self.assertEqual(result, "In-range")
    
    def test_null_result(self):
        result = analyze_test(None, "4.1 - 5.1")
        self.assertEqual(result, "Invalid result")
    
    def test_identical_min_max(self):
        result = analyze_test(5.1, "5.1 - 5.1")
        self.assertEqual(result, "In-range")
    
    def test_large_number_in_range(self):
        result = analyze_test(9999999.99, "0 - 10000000")
        self.assertEqual(result, "In-range")
    
    def test_large_number_out_of_range(self):
        result = analyze_test(99999999.99, "0 - 10000000")
        self.assertEqual(result, "Out of range")
    
    
    def test_negative_number_out_of_range(self):
        result = analyze_test(-10, "-5 - 5")
        self.assertEqual(result, "Out of range")
    
    def test_result_with_spaces(self):
        result = analyze_test(" 4.5 ", "4.1 - 5.1")
        self.assertEqual(result, "In-range")
    
    def test_range_with_spaces(self):
        result = analyze_test(4.5, " 4.1  -  5.1 ")
        self.assertEqual(result, "In-range")

if __name__ == "__main__":
    unittest.main()