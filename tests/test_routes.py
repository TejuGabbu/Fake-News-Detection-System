"""
Integration tests for Flask routes, endpoints, authentication, and analysis flow.
"""

import os
import unittest
import json
from app import app, db, User, PredictionLog, DatasetArticle

class TestAppRoutes(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///:memory:"
        app.config["WTF_CSRF_ENABLED"] = False
        self.client = app.test_client()

        with app.app_context():
            db.create_all()
            admin = User(username="testadmin", role="admin")
            admin.set_password("secretpass")
            db.session.add(admin)
            db.session.commit()

    def tearDown(self):
        with app.app_context():
            db.session.remove()
            db.drop_all()

    def test_homepage(self):
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"VERITAS", response.data)
        self.assertIn(b"News Content for Verification", response.data)

    def test_educational_hub(self):
        response = self.client.get("/educational-hub")
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"The S.I.F.T. Verification Protocol", response.data)

    def test_admin_dashboard_protected(self):
        # Unauthenticated access should redirect to login
        response = self.client.get("/admin/dashboard")
        self.assertEqual(response.status_code, 302)
        self.assertIn("/admin/login", response.headers["Location"])

    def test_admin_login_success(self):
        response = self.client.post("/admin/login", data={
            "username": "testadmin",
            "password": "secretpass"
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Admin Studio", response.data)

    def test_admin_login_failure(self):
        response = self.client.post("/admin/login", data={
            "username": "testadmin",
            "password": "wrongpassword"
        }, follow_redirects=True)
        self.assertEqual(response.status_code, 200)
        self.assertIn(b"Invalid administrator credentials", response.data)

    def test_analyze_empty_payload(self):
        response = self.client.post("/analyze", json={"text": ""})
        self.assertEqual(response.status_code, 400)
        data = json.loads(response.data)
        self.assertIn("error", data)

if __name__ == "__main__":
    unittest.main()
