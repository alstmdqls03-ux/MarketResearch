"""앱 설정 (부트스트랩 stub).

실제 시크릿 로딩(Supabase JWT secret HS256·service_role 키·외부 API 키)은
Story 3.1a에서 채운다. 지금은 환경 식별만.
"""

from __future__ import annotations

import os


class Settings:
    app_name: str = "Market Insight OS API"
    environment: str = os.getenv("APP_ENV", "development")


settings = Settings()
