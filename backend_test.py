import requests
import sys
import json
from datetime import datetime

class TaifFitAPITester:
    def __init__(self, base_url="https://fitness-taif.preview.emergentagent.com/api"):
        self.base_url = base_url
        self.token = None
        self.user_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.test_results = []

    def log_test(self, name, success, details=""):
        """Log test result"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        
        self.test_results.append({
            "test": name,
            "success": success,
            "details": details
        })

    def run_test(self, name, method, endpoint, expected_status, data=None, headers=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        test_headers = {'Content-Type': 'application/json'}
        
        if self.token:
            test_headers['Authorization'] = f'Bearer {self.token}'
        
        if headers:
            test_headers.update(headers)

        try:
            if method == 'GET':
                response = requests.get(url, headers=test_headers, timeout=30)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=test_headers, timeout=30)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=test_headers, timeout=30)
            elif method == 'DELETE':
                response = requests.delete(url, headers=test_headers, timeout=30)

            success = response.status_code == expected_status
            
            if success:
                self.log_test(name, True)
                try:
                    return True, response.json()
                except:
                    return True, response.text
            else:
                self.log_test(name, False, f"Expected {expected_status}, got {response.status_code}. Response: {response.text[:200]}")
                return False, {}

        except Exception as e:
            self.log_test(name, False, f"Exception: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test("Root API", "GET", "", 200)

    def test_register(self):
        """Test user registration"""
        timestamp = datetime.now().strftime('%H%M%S')
        test_user = {
            "email": f"test_user_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Test User {timestamp}"
        }
        
        success, response = self.run_test("User Registration", "POST", "auth/register", 200, test_user)
        
        if success and 'session_token' in response:
            self.token = response['session_token']
            self.user_id = response['user']['id']
            return True, response
        return False, {}

    def test_login(self):
        """Test user login with existing credentials"""
        # First register a user
        timestamp = datetime.now().strftime('%H%M%S')
        register_data = {
            "email": f"login_test_{timestamp}@example.com",
            "password": "TestPass123!",
            "name": f"Login Test {timestamp}"
        }
        
        # Register first
        reg_success, reg_response = self.run_test("Pre-Login Registration", "POST", "auth/register", 200, register_data)
        
        if not reg_success:
            return False, {}
        
        # Now test login
        login_data = {
            "email": register_data["email"],
            "password": register_data["password"]
        }
        
        success, response = self.run_test("User Login", "POST", "auth/login", 200, login_data)
        return success, response

    def test_get_me(self):
        """Test getting current user info"""
        if not self.token:
            self.log_test("Get Current User", False, "No token available")
            return False, {}
        
        return self.run_test("Get Current User", "GET", "auth/me", 200)

    def test_body_analysis(self):
        """Test body analysis creation"""
        if not self.token:
            self.log_test("Body Analysis", False, "No token available")
            return False, {}
        
        analysis_data = {
            "weight": 75.5,
            "height": 175.0,
            "age": 28,
            "gender": "male",
            "goal": "lose_weight"
        }
        
        success, response = self.run_test("Create Body Analysis", "POST", "body-analyses", 200, analysis_data)
        
        if success:
            # Test getting analyses
            self.run_test("Get Body Analyses", "GET", "body-analyses", 200)
        
        return success, response

    def test_workout_plan(self):
        """Test workout plan generation"""
        if not self.token:
            self.log_test("Workout Plan", False, "No token available")
            return False, {}
        
        plan_data = {
            "location": "gym",
            "days_per_week": 4
        }
        
        success, response = self.run_test("Create Workout Plan", "POST", "workout-plans", 200, plan_data)
        
        if success:
            # Test getting plans
            self.run_test("Get Workout Plans", "GET", "workout-plans", 200)
        
        return success, response

    def test_nutrition_plan(self):
        """Test nutrition plan generation"""
        if not self.token:
            self.log_test("Nutrition Plan", False, "No token available")
            return False, {}
        
        nutrition_data = {
            "target_calories": 2200
        }
        
        success, response = self.run_test("Create Nutrition Plan", "POST", "nutrition-plans", 200, nutrition_data)
        
        if success:
            # Test getting plans
            self.run_test("Get Nutrition Plans", "GET", "nutrition-plans", 200)
        
        return success, response

    def test_progress_logs(self):
        """Test progress logging"""
        if not self.token:
            self.log_test("Progress Logs", False, "No token available")
            return False, {}
        
        progress_data = {
            "weight": 74.2,
            "body_fat": 15.5,
            "notes": "Feeling stronger this week!"
        }
        
        success, response = self.run_test("Create Progress Log", "POST", "progress-logs", 200, progress_data)
        
        if success:
            # Test getting logs
            self.run_test("Get Progress Logs", "GET", "progress-logs", 200)
        
        return success, response

    def test_google_oauth_session(self):
        """Test Google OAuth session endpoint (simulated)"""
        # This would normally require a real session_id from Google OAuth
        # We'll test the endpoint structure but expect it to fail with invalid session
        headers = {'X-Session-ID': 'test_session_id_123'}
        success, response = self.run_test("Google OAuth Session (Expected Fail)", "GET", "auth/session", 401, headers=headers)
        
        # For this test, we expect it to fail with 401, so we'll mark it as passed if it returns 401
        if not success and "401" in str(response):
            self.log_test("Google OAuth Endpoint Structure", True, "Endpoint exists and properly rejects invalid session")
            return True, {}
        return False, {}

    def test_logout(self):
        """Test user logout"""
        if not self.token:
            self.log_test("Logout", False, "No token available")
            return False, {}
        
        return self.run_test("User Logout", "POST", "auth/logout", 200)

    def run_all_tests(self):
        """Run comprehensive API test suite"""
        print("🚀 Starting Taif Fit AI API Tests...")
        print(f"🔗 Testing against: {self.base_url}")
        print("=" * 60)
        
        # Test basic connectivity
        self.test_root_endpoint()
        
        # Test authentication flow
        self.test_register()
        self.test_login()
        self.test_get_me()
        
        # Test core features (requires authentication)
        self.test_body_analysis()
        self.test_workout_plan()
        self.test_nutrition_plan()
        self.test_progress_logs()
        
        # Test OAuth structure
        self.test_google_oauth_session()
        
        # Test logout
        self.test_logout()
        
        # Print summary
        print("=" * 60)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.tests_passed == self.tests_run:
            print("🎉 All tests passed!")
            return 0
        else:
            print(f"⚠️  {self.tests_run - self.tests_passed} tests failed")
            return 1

def main():
    tester = TaifFitAPITester()
    return tester.run_all_tests()

if __name__ == "__main__":
    sys.exit(main())