"""
Configuration module for Google Gemini API integration in the AI-Powered Todo Chatbot.

This module handles the setup and configuration for Google Gemini API access.
"""

import os
from typing import Optional
try:
    import google.genai as genai
    from google.genai import GenerativeModel
    print("Using new google.genai package in google_config")
except ImportError:
    # Fallback to deprecated package for backward compatibility
    import google.generativeai as genai
    from google.generativeai import GenerativeModel
    print("Using deprecated google.generativeai package in google_config")


def initialize_gemini():
    """
    Initializes the Google Generative AI client with the API key from environment.

    Raises:
        ValueError: If neither GOOGLE_API_KEY nor GEMINI_API_KEY is set in environment
    """
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY environment variable is required")

    # Configure API key based on the package being used
    try:
        # New google.genai package - API key is passed directly to model initialization
        pass  # In new package, API key is passed during model creation
    except:
        # Legacy google.generativeai package - needs configure call
        genai.configure(api_key=api_key)


def get_gemini_model(model_name: str = "gemini-1.5-flash") -> GenerativeModel:
    """
    Creates and returns a Gemini model instance configured with the API key from environment.

    Args:
        model_name: The name of the Gemini model to use (default: gemini-1.5-flash)

    Returns:
        GenerativeModel: Configured Gemini model instance

    Raises:
        ValueError: If neither GOOGLE_API_KEY nor GEMINI_API_KEY is set in environment
    """
    api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise ValueError("GOOGLE_API_KEY or GEMINI_API_KEY environment variable is required")

    # Configure API key based on the package being used
    try:
        # New google.genai package approach - API key is passed during model creation
        # For google.genai, the API key is set globally or passed to a client
        import google
        if hasattr(google, 'genai'):  # This is the new package
            # For now, we'll continue using the legacy approach until we properly migrate
            genai.configure(api_key=api_key)
    except:
        # Legacy google.generativeai package - needs configure call
        genai.configure(api_key=api_key)

    # Use the configured model, default to free gemini-1.5-flash if not set
    model_name = os.getenv("GEMINI_MODEL", model_name)

    # If the primary model fails, fall back to other free models
    # ALL FREE MODELS - Updated with latest Gemini 2.0 models
    available_models = [
        model_name,  # Primary model from env var
        "gemini-2.0-flash-exp",          # ⭐ Latest & fastest free model (Feb 2025)
        "gemini-1.5-flash",              # Most reliable free model
        "gemini-1.5-flash-002",          # Updated flash variant
        "gemini-1.5-flash-8b",           # Fast & lightweight
        "gemini-1.5-flash-8b-001",       # Flash 8B variant
        "gemini-1.5-pro",                # More powerful free model
        "gemini-1.5-pro-002",            # Updated pro variant
        "gemini-exp-1206",               # Experimental (Dec 2024)
        "gemini-exp-1121",               # Experimental (Nov 2024)
        "gemma-2-9b-it",                 # Open source fallback
        "gemma-2-2b-it",                 # Lightweight open source
    ]

    # Try each model until one works
    for model in available_models:
        try:
            return genai.GenerativeModel(model)
        except Exception as e:
            print(f"Model {model} failed: {e}")
            continue

    # If all models fail, raise an exception
    raise ValueError(f"None of the available models worked. Last tried: {available_models[-1]}")


def get_alternative_free_models() -> list:
    """
    Returns a list of alternative free Gemini models that can be used when the primary model is limited.

    Returns:
        list: List of available free model names (Updated with Gemini 2.0)
    """
    return [
        "gemini-2.0-flash-exp",          # Latest & fastest (Feb 2025)
        "gemini-1.5-flash",              # Most reliable
        "gemini-1.5-flash-002",          # Flash variant
        "gemini-1.5-flash-8b",           # Lightweight
        "gemini-1.5-flash-8b-001",       # 8B variant
        "gemini-1.5-pro",                # Powerful
        "gemini-1.5-pro-002",            # Pro variant
        "gemini-exp-1206",               # Experimental Dec
        "gemini-exp-1121",               # Experimental Nov
        "gemma-2-9b-it",                 # Open source
        "gemma-2-2b-it",                 # Lightweight open source
    ]


def get_assistant_config() -> dict:
    """
    Returns the configuration for the Gemini assistant used in the chatbot.

    Returns:
        dict: Assistant configuration including model, instructions, and parameters
    """
    return {
        "model": os.getenv("GEMINI_MODEL", "gemini-1.5-flash"),  # Use free flash model
        "generation_config": {
            "temperature": float(os.getenv("GEMINI_TEMPERATURE", "0.7")),
            "max_output_tokens": int(os.getenv("GEMINI_MAX_TOKENS", "500")),
            "candidate_count": 1
        },
        "safety_settings": [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_ONLY_HIGH"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_ONLY_HIGH"
            },
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_ONLY_HIGH"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_ONLY_HIGH"
            }
        ],
        "instructions": os.getenv(
            "ASSISTANT_INSTRUCTIONS",
            "You are a helpful AI assistant that helps users manage their todo tasks. "
            "You can add, list, update, complete, and delete tasks. "
            "Always respond in the same language as the user's input (English or Urdu). "
            "Be concise and helpful."
        )
    }


class GeminiConfig:
    """
    Configuration class for Google Gemini integration with additional settings.
    """

    def __init__(self):
        self.api_key = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
        self.model_name = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")  # Free flash model
        self.generation_config = {
            "temperature": float(os.getenv("GEMINI_TEMPERATURE", "0.7")),
            "max_output_tokens": int(os.getenv("GEMINI_MAX_TOKENS", "500")),
            "candidate_count": 1
        }
        self.safety_settings = [
            {
                "category": "HARM_CATEGORY_DANGEROUS_CONTENT",
                "threshold": "BLOCK_ONLY_HIGH"
            },
            {
                "category": "HARM_CATEGORY_HATE_SPEECH",
                "threshold": "BLOCK_ONLY_HIGH"
            },
            {
                "category": "HARM_CATEGORY_HARASSMENT",
                "threshold": "BLOCK_ONLY_HIGH"
            },
            {
                "category": "HARM_CATEGORY_SEXUALLY_EXPLICIT",
                "threshold": "BLOCK_ONLY_HIGH"
            }
        ]

    def get_model(self) -> GenerativeModel:
        """Returns the configured Gemini model."""
        return get_gemini_model(self.model_name)