# design-pattern-middle (망가진 코드 — 패턴 미적용)

강의 3단계 실습의 **2단계**. 같은 요구사항을 **디자인패턴 없이** 푼 동작 코드입니다.
if-else·복붙·직접 생성 등 안티패턴으로 "왜 패턴이 필요한가"를 체감시키는 용도입니다.
각 파일 상단 주석에 불편한 이유를 적어 두었습니다. 이 단계를 함께 실습한 뒤 `../design-pattern-end`(패턴 적용)로 리팩터링합니다.

- 대상 예제: ex02 ~ ex14
- 시작코드(스켈레톤): `../design-pattern-start`
- 완성코드(패턴 적용): `../design-pattern-end`

## 실행

```bash
# 예: ex02
javac -encoding UTF-8 -d bin $(find src/ex02 -name '*.java')
java -cp bin ex02.App
# ex09만 무한 polling 루프 → java ... ex09.polling.App 실행 후 몇 초 뒤 Ctrl-C
```

## 예제 ↔ 안티패턴(패턴이 없어서 생기는 문제)

| 예제 | 패턴 | middle의 안티패턴 |
|------|------|------------------|
| ex02 | OCP / 다형성 | if-else 면적계산기 (새 도형마다 수정 → OCP 위반) |
| ex03 | Strategy | 하드코딩 if-else Doorman (런타임 전략 교체 불가) |
| ex04 | Proxy | Doorman에 지갑검사 직접 삽입 (책임 뒤섞임) |
| ex05 | Adapter | 외부 타입 전용 오버로드 (타입 늘 때마다 Doorman 수정) |
| ex06 | Singleton | public 생성자 + new 남발 (인스턴스 여러 개) |
| ex07 | Template Method | 각 교사가 공통 흐름 복붙 (흐름 바뀌면 전부 수정) |
| ex08 | Delegation | Delegator가 if-else로 직접 수행 (위임 없음) |
| ex09 | Observer | polling (1초마다 직접 물어봄, 낭비) |
| ex10 | Decorator | 조합마다 클래스 따로 (조합 폭발) |
| ex11 | DI / Mock | MeterService가 Real 직접 생성 (Mock 교체·테스트 불가) |
| ex12 | DI / Mock + 테스트 | OrderService가 Real 직접 생성 (단위 테스트 불가) |
| ex13 | Simple Factory | App이 직접 new + setUrl (생성 코드 흩뿌려짐) |
| ex14 | Factory Method | if-else Simple Factory (새 DB마다 수정 → OCP 위반) |
