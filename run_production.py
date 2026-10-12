"""
Production server runner using Waitress WSGI.
Provides multi-threaded production performance across Windows and Linux.
"""
import os
from waitress import serve
from app import app

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    host = os.environ.get("HOST", "0.0.0.0")
    print("=" * 60)
    print(" Veritas AI: Production Web Server (Waitress WSGI)")
    print(f" Listening on http://localhost:{port} (All interfaces: http://{host}:{port})")
    print(" Production-ready multi-threaded WSGI runner active.")
    print("=" * 60)
    serve(app, host=host, port=port, threads=6)
