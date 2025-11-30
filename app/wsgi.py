"""
Compatibility WSGI module for platforms that expect `app.wsgi`.

This simply re-exports the project's Django WSGI `application` from
`Cipher.wsgi`. It avoids changing external deployment configuration.
"""
from Cipher.wsgi import application  # re-export WSGI application
