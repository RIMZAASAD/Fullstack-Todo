import pytest
import os
from datetime import datetime, timedelta
from jose import jwt
from src.auth.jwt import create_access_token, verify_token, decode_token_payload, get_user_id_from_token


# Set a test secret key for testing
os.environ["BETTER_AUTH_SECRET"] = "test_secret_key_for_testing"


def test_create_access_token():
    """
    Test creating a valid access token
    """
    data = {"user_id": "test_user_123"}
    token = create_access_token(data)

    # Verify that we got a token
    assert token is not None
    assert isinstance(token, str)
    assert len(token) > 0


def test_create_access_token_with_expiration():
    """
    Test creating a token with custom expiration
    """
    data = {"user_id": "test_user_123"}
    expires_delta = timedelta(minutes=30)
    token = create_access_token(data, expires_delta=expires_delta)

    # Decode the token to check expiration
    decoded = jwt.decode(token, os.getenv("BETTER_AUTH_SECRET"), algorithms=["HS256"])
    exp = decoded.get("exp")

    assert exp is not None
    # Check that expiration is approximately 30 minutes from now
    expected_exp = datetime.utcnow() + expires_delta
    actual_exp = datetime.fromtimestamp(exp)

    # Allow a small time difference for processing
    time_diff = abs((expected_exp - actual_exp).total_seconds())
    assert time_diff < 5  # Less than 5 seconds difference


def test_verify_token_valid():
    """
    Test verifying a valid token
    """
    data = {"user_id": "test_user_123"}
    token = create_access_token(data)

    # This should not raise an exception and return the payload
    payload = verify_token(token)

    assert payload is not None
    assert payload["user_id"] == "test_user_123"


def test_verify_token_invalid():
    """
    Test verifying an invalid token
    """
    from fastapi import HTTPException

    # Try to verify a malformed token
    with pytest.raises(HTTPException) as exc_info:
        verify_token("invalid_token_string")

    assert exc_info.value.status_code == 401


def test_verify_token_expired():
    """
    Test verifying an expired token
    """
    from fastapi import HTTPException

    # Create an expired token
    data = {"user_id": "test_user_123", "exp": datetime.utcnow() - timedelta(minutes=1)}
    expired_token = jwt.encode(data, os.getenv("BETTER_AUTH_SECRET"), algorithm="HS256")

    with pytest.raises(HTTPException) as exc_info:
        verify_token(expired_token)

    assert exc_info.value.status_code == 401


def test_decode_token_payload_valid():
    """
    Test decoding a valid token payload
    """
    data = {"user_id": "test_user_123", "role": "user"}
    token = create_access_token(data)

    payload = decode_token_payload(token)

    assert payload is not None
    assert payload["user_id"] == "test_user_123"
    assert payload["role"] == "user"


def test_decode_token_payload_invalid():
    """
    Test decoding an invalid token payload
    """
    payload = decode_token_payload("invalid_token_string")

    assert payload is None


def test_decode_token_payload_expired():
    """
    Test decoding an expired token payload
    """
    # Create an expired token
    data = {"user_id": "test_user_123", "exp": datetime.utcnow() - timedelta(minutes=1)}
    expired_token = jwt.encode(data, os.getenv("BETTER_AUTH_SECRET"), algorithm="HS256")

    payload = decode_token_payload(expired_token)

    assert payload is None


def test_get_user_id_from_token_valid():
    """
    Test extracting user_id from a valid token
    """
    data = {"user_id": "test_user_123"}
    token = create_access_token(data)

    user_id = get_user_id_from_token(token)

    assert user_id == "test_user_123"


def test_get_user_id_from_token_invalid():
    """
    Test extracting user_id from an invalid token
    """
    user_id = get_user_id_from_token("invalid_token_string")

    assert user_id is None


def test_get_user_id_from_token_no_user_id():
    """
    Test extracting user_id from a token without user_id claim
    """
    data = {"role": "user", "permissions": ["read"]}
    token = create_access_token(data)

    user_id = get_user_id_from_token(token)

    assert user_id is None