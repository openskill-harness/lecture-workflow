# design-pattern-start (시작코드)

강의 3단계 실습의 **1단계**. 학생에게 배포하는 스켈레톤입니다.
도메인 클래스와 틀(구조)은 채워져 있고, **각 예제 디자인패턴의 핵심 메서드 본문만 `// TODO`** 로 비어 있습니다.
학생은 TODO만 채우면 됩니다. 컴파일은 되지만(더미 반환), 실행 결과는 TODO를 채워야 정상입니다.

- 대상 예제: ex02 ~ ex14 (패턴별 1개)
- 정답: `../design-pattern-end`
- 함께 볼 안티패턴(왜 패턴이 필요한가): `../design-pattern-middle`

## 실행

```bash
# 예: ex02
javac -encoding UTF-8 -d bin $(find src/ex02 -name '*.java')
java -cp bin ex02.App
```

## 예제 ↔ 패턴

| 예제 | 패턴 | 채울 TODO(핵심) |
|------|------|----------------|
| ex02 | OCP / 다형성 | `Circle·Rectangle.넓이()` |
| ex03 | Strategy | `Doorman.setTarget()·쫒아내()` |
| ex04 | Proxy | `DoormanProxy·DoormanProxy2.쫓아내()` |
| ex05 | Adapter | `RabbitAdapter.getName()` |
| ex06 | Singleton | `Doorman.쫒아내()` |
| ex07 | Template Method | 각 `Teacher.강의하기()` |
| ex08 | Delegation | 학생 `doHomework()·isSameHomework()`, `delegateHomework()` |
| ex09 | Observer (push) | `Mart.add()·remove()·notify()` |
| ex10 | Decorator | `Email·SmsNotifier.send()` |
| ex11 | DI / Mock | `MeterService.render()`, `getStep()` |
| ex12 | DI / Mock + 테스트 | `OrderService.주문()`, `결제()` |
| ex13 | Simple Factory | `DBFactory.createDB()` |
| ex14 | Factory Method | `Maria·OracleDBFactory.생성()` |
