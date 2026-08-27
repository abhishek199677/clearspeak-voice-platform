"""API Key authentication for ClearSpeak AI."""

from typing import Optional
from fastapi import HTTPException, Security
from fastapi.security import APIKeyHeader
from backend.config import get_settings

settings = get_settings()
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)


async def verify_api_key(api_key: Optional[str] = Security(api_key_header)) -> Optional[str]:
    """
    Verify API key from request header.
    
    Args:
        api_key: API key from X-API-Key header
        
    Returns:
        API key if valid
        
    Raises:
        HTTPException: If API key is invalid
    """
    if not settings.api_key:
        return None
    
    if api_key is None:
        raise HTTPException(
            status_code=401,
            detail="API key required"
        )
    
    if api_key != settings.api_key:
        raise HTTPException(
            status_code=403,
            detail="Invalid API key"
        )
    
    return api_key
