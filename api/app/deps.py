"""FastAPI 의존성 (부트스트랩 stub).

실제 구현(Story 3.1a):
- Supabase JWT 로컬 검증(HS256, ``audience="authenticated"``, ``sub``=user_id) —
  ``get_user()`` 네트워크 왕복 회피.
- 사용자 토큰 Supabase 클라이언트(RLS 통과)로 ``record_decision`` 호출.
- ``service_role`` 키는 야간 배치 전용으로 격리.
지금은 자리만 잡는다.
"""

from __future__ import annotations
