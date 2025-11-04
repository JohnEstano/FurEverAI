"""
🧪 FurEver.AI Backend API Test Suite

Run this script to test all 6 ML endpoints after starting the server.

Usage:
    python test_api.py

You can override the base URL via environment variable:
    set FUREVER_API_BASE=http://127.0.0.1:5000
"""

import os
import time
import requests
import json

# Default to 127.0.0.1 to avoid some Windows localhost resolution issues
BASE_URL = os.environ.get("FUREVER_API_BASE", "http://127.0.0.1:5000")

def print_test_header(test_name):
    print(f"\n{'='*60}")
    print(f"🧪 TEST: {test_name}")
    print('='*60)

def print_response(response):
    print(f"Status Code: {response.status_code}")
    print(f"Response:")
    print(json.dumps(response.json(), indent=2))


def wait_for_server(timeout_seconds: int = 10) -> bool:
    """Wait until the /api/health endpoint returns 200 or timeout."""
    deadline = time.time() + timeout_seconds
    url = f"{BASE_URL}/api/health"
    last_err = None
    while time.time() < deadline:
        try:
            resp = requests.get(url, timeout=1.5)
            if resp.status_code == 200:
                print("Server is up:", resp.json())
                return True
        except Exception as e:
            last_err = e
        time.sleep(0.5)
    if last_err:
        print(f"Could not reach server at {url}: {last_err}")
    return False

# =======================================================
# TEST 0: Health Check
# =======================================================
def test_health():
    print_test_header("Health Check")
    response = requests.get(f"{BASE_URL}/api/health")
    print_response(response)
    assert response.status_code == 200
    assert response.json()['status'] == 'ok'
    print("✅ PASSED")

# =======================================================
# TEST 1: Decision Tree - Pawsonality
# =======================================================
def test_pawsonality():
    print_test_header("Decision Tree - Pawsonality Classification")
    
    data = {
        "Housing_Type": "Apartment",
        "Has_Kids": 0,
        "Time_At_Home": 2,
        "Activity_Level": 1,
        "Experience_Level": "First_Time",
        "Pet_Type_Desired": "Cat"
    }
    
    print(f"Input: {json.dumps(data, indent=2)}")
    response = requests.post(f"{BASE_URL}/api/predict", json=data)
    print_response(response)
    
    assert response.status_code == 200
    assert 'pawsonality' in response.json()
    print(f"✅ PASSED - Pawsonality: {response.json()['pawsonality']}")

# =======================================================
# TEST 2: SVM - Core Matching
# =======================================================
def test_match_score():
    print_test_header("SVM - Core Matching Score")
    
    data = {
        "Activity_Level": 2,
        "Has_Kids": 1,
        "Experience_Level": "Past_Owner",
        "Pet_Energy_Level": 2,
        "Pet_Good_With_Kids": 1,
        "Pet_Size": "Medium",
        "Pet_Grooming_Needs": "Low"
    }
    
    print(f"Input: {json.dumps(data, indent=2)}")
    response = requests.post(f"{BASE_URL}/api/match", json=data)
    print_response(response)
    
    assert response.status_code == 200
    assert 'match_score' in response.json()
    print(f"✅ PASSED - Match Score: {response.json()['match_score']}%")

# =======================================================
# TEST 3: Naive Bayes - Auto-Tagging
# =======================================================
def test_auto_tagging():
    print_test_header("Naive Bayes - Auto-Tagging")
    
    data = {
        "description": "A friendly young dog who loves kids and outdoor activities. Perfect for an active family with a big yard!"
    }
    
    print(f"Input Description: {data['description']}")
    response = requests.post(f"{BASE_URL}/api/tags", json=data)
    print_response(response)
    
    assert response.status_code == 200
    assert 'tags' in response.json()
    print(f"✅ PASSED - Tags: {response.json()['tags']}")

# =======================================================
# TEST 4: KNN - Recommendations
# =======================================================
def test_recommendations():
    print_test_header("KNN - Recommendations")
    
    data = {
        "Pet_ID": "P0050",
        "n_recommendations": 5
    }
    
    print(f"Input: {json.dumps(data, indent=2)}")
    response = requests.post(f"{BASE_URL}/api/recommend", json=data)
    print_response(response)
    
    assert response.status_code == 200
    assert 'recommended_pet_ids' in response.json()
    print(f"✅ PASSED (Mock Data)")

# =======================================================
# TEST 5: ANN - Deep Matching
# =======================================================
def test_deep_match():
    print_test_header("ANN - Deep Match Score")
    
    data = {
        "Activity_Level": 3,
        "Has_Kids": 0,
        "Experience_Level": "Expert",
        "Pet_Energy_Level": 3,
        "Pet_Good_With_Kids": 0,
        "Pet_Size": "Large",
        "Pet_Grooming_Needs": "High"
    }
    
    print(f"Input: {json.dumps(data, indent=2)}")
    response = requests.post(f"{BASE_URL}/api/deep-match", json=data)
    print_response(response)
    
    assert response.status_code == 200
    assert 'deep_match_score' in response.json()
    print(f"✅ PASSED - Deep Match Score: {response.json()['deep_match_score']}%")

# =======================================================
# TEST 6: Linear Regression - Adoption Prediction
# =======================================================
def test_adoption_prediction():
    print_test_header("Linear Regression - Adoption Timeline")
    
    data = {
        "Type": "Dog",
        "Age_Group": "Young_Adult",
        "Size": "Medium",
        "Energy_Level": 2,
        "Grooming_Needs": "Low"
    }
    
    print(f"Input: {json.dumps(data, indent=2)}")
    response = requests.post(f"{BASE_URL}/api/adoption-prediction", json=data)
    print_response(response)
    
    assert response.status_code == 200
    assert 'predicted_days' in response.json()
    print(f"✅ PASSED - Predicted Days: {response.json()['predicted_days']}")

# =======================================================
# RUN ALL TESTS
# =======================================================
def run_all_tests():
    print("\n🚀 Starting FurEver.AI Backend Test Suite")
    print(f"Testing server at: {BASE_URL}")

    # Ensure server is reachable before running tests
    if not wait_for_server(timeout_seconds=12):
        print("\n❌ ERROR: Backend is not reachable." )
        print("Make sure to start the server in another terminal:")
        print("  python server.py")
        return
    
    tests = [
        ("Health Check", test_health),
        ("Pawsonality (DT)", test_pawsonality),
        ("Match Score (SVM)", test_match_score),
        ("Auto-Tagging (NB)", test_auto_tagging),
        ("Recommendations (KNN)", test_recommendations),
        ("Deep Match (ANN)", test_deep_match),
        ("Adoption Prediction (LR)", test_adoption_prediction)
    ]
    
    passed = 0
    failed = 0
    
    for name, test_func in tests:
        try:
            test_func()
            passed += 1
        except Exception as e:
            print(f"❌ FAILED: {name}")
            print(f"   Error: {str(e)}")
            failed += 1
    
    print(f"\n{'='*60}")
    print(f"📊 TEST SUMMARY")
    print('='*60)
    print(f"✅ Passed: {passed}/{len(tests)}")
    print(f"❌ Failed: {failed}/{len(tests)}")
    
    if failed == 0:
        print("\n🎉 All tests passed! Backend is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the errors above.")

if __name__ == "__main__":
    try:
        run_all_tests()
    except requests.exceptions.ConnectionError:
        print(f"\n❌ ERROR: Cannot connect to {BASE_URL}")
        print("Make sure the server is running:")
        print("  cd server")
        print("  python server.py")
