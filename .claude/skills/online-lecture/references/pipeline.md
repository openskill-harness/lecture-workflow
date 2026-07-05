# 온라인강의 레슨 파이프라인 (유튜브 판서 VOD — v1.7)

온라인 라인 = **유튜브 녹화 판서 강의**. 강사가 요약 슬라이드(summary 프로파일) 위에 무조건 판서하며 진행한다.

```yaml
lesson_pipeline_registry:
  THEORY: online-theory-lesson-pipeline
  # SIMULATION 폐지 (v1.7) — 시뮬레이터는 레슨의 파트 (아래 시뮬 파트 절차)
  # LAB / HYBRID: 현재 온라인 계약(원고·판서슬라이드·시뮬레이터 3종) 밖 — 아래 참고
```

**LAB/HYBRID 레슨이 나오면:** 온라인 라인의 현재 계약에는 실습 코드 산출물이 없다. lesson-classifier가 온라인 강의에 LAB/HYBRID를 부여하면 오케스트레이터는 G2에서 다음 중 하나를 사용자에게 확인한다: (a) THEORY로 재구성(시뮬 파트 포함 가능), (b) 온라인 code-along 계약 추가 — 이 경우 설계 문서 개정 + GPT 교차 검증을 먼저 거친다. 임의로 lab-code-agent를 호출하지 않는다.

## online-theory-lesson-pipeline

```text
script-agent (섹션 구조 원고: hook/concept/visual/interaction/summary
              — THEORY 서사 구조를 섹션 흐름에 녹인다. 판서 전제: visual 필드는
              "강사가 판서로 그릴 것"을 명세한다)
→ [시뮬 파트 해당 시: 아래 시뮬 파트 절차]
→ [G5: 컷 구성·비유 방향 승인]
→ panseo-slide-agent (summary 프로파일 — 판서슬라이드 + 판서대본, 원고 섹션 순서와 일치)
→ qa-agent (incremental: 원고 섹션↔컷 흐름 정합, 판서 여백 존재)
```

research-agent는 출처 필수 주장(통계·버전 특정 등)이 원고에 필요할 때만 선행 호출한다 — 온라인 라인은 단순 유지가 원칙.

## 시뮬 파트 (v1.7 — required_artifacts에 simulator가 있는 레슨에 삽입)

```text
research-agent (개념 검증 재료) → simulator-agent (profile: online_self_paced
  — 영상 속 강사 시연 + 시청자 배포 겸용이므로 시작 안내·리셋·진행 표시 유지,
  concept_model 대조 검증)
→ script-agent가 원고의 interaction 필드/시뮬 파트를 서술
  ([SIM 실행]~[SIM 종료] + 파트 시간 — 영상에서는 강사가 조작 시연, 설명란에 시뮬 링크 제공)
→ qa-agent incremental: 원고 cue↔시뮬 단계 일치, 자기주도 장치 존재
```
