#!/usr/bin/env python3
"""Cross-platform server launcher.

On Linux (production), this execs Gunicorn. On Windows (dev), it uses Waitress
so users can run a production-like WSGI server locally without fcntl.
"""
import os
import platform
import sys
import subprocess

PORT = os.environ.get('PORT', '8000')

def run_waitress():
    try:
        from waitress import serve
    except Exception:
        print("Waitress is not installed. Install it with: python -m pip install waitress")
        sys.exit(1)

    # Import the Django WSGI application and serve it
    try:
        from Cipher.wsgi import application
    except Exception as e:
        print("Error importing WSGI application:", e)
        raise

    print(f"Starting Waitress on 0.0.0.0:{PORT}")
    serve(application, host='0.0.0.0', port=int(PORT))

def run_gunicorn():
    # Exec gunicorn so it replaces this process (same behavior as before)
    cmd = [
        'gunicorn',
        'Cipher.wsgi:application',
        '--bind',
        f'0.0.0.0:{PORT}',
    ]
    print('Starting Gunicorn:', ' '.join(cmd))
    os.execvp('gunicorn', cmd)

def main():
    system = platform.system().lower()
    if 'windows' in system:
        run_waitress()
    else:
        run_gunicorn()

if __name__ == '__main__':
    main()
