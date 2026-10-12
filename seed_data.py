"""
Seed script to initialize SQLite database with default admin user,
dataset records, and initial telemetry data.
"""

import os
from app import app, seed_database, init_ml_pipeline

if __name__ == "__main__":
    print("--- Initializing Veritas AI Database & Machine Learning Artifacts ---")
    seed_database()
    init_ml_pipeline()
    print("--- Initialization Complete! System is ready to run ---")
