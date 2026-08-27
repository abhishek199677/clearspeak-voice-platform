"""
Voice AI Platform - Structured Logging
Production-grade logging with context and correlation.
"""

import logging
import sys
from typing import Any, Dict
import structlog
from pythonjsonlogger import jsonlogger


def setup_logging(log_level: str = "INFO", json_output: bool = True):
    """
    Configure structured logging for the application.
    
    Args:
        log_level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        json_output: Whether to output JSON format
    """
    # Configure structlog
    structlog.configure(
        processors=[
            structlog.contextvars.merge_contextvars,
            structlog.processors.add_log_level,
            structlog.processors.StackInfoRenderer(),
            structlog.dev.set_exc_info,
            structlog.processors.TimeStamper(fmt="iso"),
            structlog.processors.JSONRenderer() if json_output else structlog.dev.ConsoleRenderer()
        ],
        context_class=dict,
        logger_factory=structlog.PrintLoggerFactory(),
        wrapper_class=structlog.BoundLogger,
        cache_logger_on_first_use=True,
    )
    
    # Configure standard library logging
    handler = logging.StreamHandler(sys.stdout)
    
    if json_output:
        formatter = jsonlogger.JsonFormatter(
            fmt="%(asctime)s %(name)s %(levelname)s %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S"
        )
    else:
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
    
    handler.setFormatter(formatter)
    
    root_logger = logging.getLogger()
    root_logger.handlers.clear()
    root_logger.addHandler(handler)
    root_logger.setLevel(getattr(logging, log_level.upper()))
    
    # Reduce noise from third-party libraries
    logging.getLogger("httpx").setLevel(logging.WARNING)
    logging.getLogger("httpcore").setLevel(logging.WARNING)
    logging.getLogger("uvicorn").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    
    structlog.get_logger("logging").info(
        "Logging configured",
        log_level=log_level,
        json_output=json_output
    )


class RequestLogger:
    """
    Request context logger for tracking operations.
    """
    
    def __init__(self, session_id: str, component: str):
        self.session_id = session_id
        self.component = component
        self.logger = structlog.get_logger()
    
    def info(self, message: str, **kwargs):
        self.logger.info(
            message,
            session_id=self.session_id,
            component=self.component,
            **kwargs
        )
    
    def error(self, message: str, **kwargs):
        self.logger.error(
            message,
            session_id=self.session_id,
            component=self.component,
            **kwargs
        )
    
    def warning(self, message: str, **kwargs):
        self.logger.warning(
            message,
            session_id=self.session_id,
            component=self.component,
            **kwargs
        )
    
    def debug(self, message: str, **kwargs):
        self.logger.debug(
            message,
            session_id=self.session_id,
            component=self.component,
            **kwargs
        )
