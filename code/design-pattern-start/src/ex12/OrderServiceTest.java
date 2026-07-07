package ex12;

/**
 * 단위 테스트 (라이브러리 없는 순수 Java 버전)
 *
 * 핵심 : 진짜 결제 서버가 없어도, 가짜(MockPayGate)로 '주문 로직'만 콕 집어 검증한다.
 *        → 이 테스트가 통과하면, 나중에 진짜 결제로 바꿔도 주문 로직은 안전하다.
 *
 * JUnit 같은 외부 라이브러리 없이 main() 하나로 바로 돌아간다. (설치/인터넷 불필요)
 *
 * 실행(VS Code) : 이 파일의 main() 위 초록 ▶ 버튼 클릭
 * 실행(명령줄)   : javac -d bin src/ex12/*.java  →  java -cp bin ex12.OrderServiceTest
 */
public class OrderServiceTest {

    // ── 아주 작은 자체 테스트 도구 (assertTrue / assertFalse 흉내) ──
    static int passed = 0;
    static int failed = 0;

    static void assertTrue(String name, boolean condition) {
        if (condition) {
            passed++;
            System.out.println("  [통과] " + name);
        } else {
            failed++;
            System.out.println("  [실패] " + name + " → true 를 기대했지만 false");
        }
    }

    static void assertFalse(String name, boolean condition) {
        assertTrue(name, !condition);
    }

    // ── 테스트들 ──
    static void 정상금액_주문성공() {
        OrderService service = new OrderService(new MockPayGate());
        assertTrue("정상 금액이면 주문 성공", service.주문(1000));
    }

    static void 영원_주문실패() {
        OrderService service = new OrderService(new MockPayGate());
        assertFalse("0원이면 주문 실패", service.주문(0));
    }

    static void 음수_주문실패() {
        OrderService service = new OrderService(new MockPayGate());
        assertFalse("음수면 주문 실패", service.주문(-500));
    }

    public static void main(String[] args) {
        System.out.println("== OrderService 단위 테스트 시작 ==");
        정상금액_주문성공();
        영원_주문실패();
        음수_주문실패();
        System.out.println("== 결과 : 통과 " + passed + " / 실패 " + failed + " ==");

        // 실패가 하나라도 있으면 0이 아닌 종료 코드로 알림 (CI/자동화 친화)
        if (failed > 0) {
            System.exit(1);
        }
    }
}
