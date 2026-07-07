package ex12;

/**
 * 목표 : Mock 으로 '병렬 개발' + 'AI 프렌들리 코드' 체험
 *
 * [병렬 개발 이야기]
 *  1일차 : PayGate(계약)만 합의한다.
 *  그 다음부터 동시에 →
 *    - 프론트 팀 : MockPayGate 로 OrderService 를 개발/테스트  (백엔드 안 기다림)
 *    - 백엔드 팀 : RealPayGate 를 개발
 *  마지막 : Mock 을 Real 로 '갈아끼우기'만 하면 끝.  (OrderService 는 안 고침)
 *
 * [왜 AI 프렌들리인가]
 *  - 인터페이스(PayGate) = AI 에게 "무엇을 만들지" 를 모호함 없이 알려주는 스펙
 *  - 단위 테스트(OrderServiceTest) = AI 가 짠 코드를 자동으로 검증 (실수 즉시 발견)
 *  - Mock 으로 분리 = 한 번에 작은 조각만 맡길 수 있어 AI 가 다루기 쉬움
 */
public class App {
    public static void main(String[] args) {

        // 개발 초기 : 백엔드가 아직 없다 → 가짜로 먼저 돌려본다
        System.out.println("== 개발 중 (Mock) ==");
        OrderService devService = new OrderService(new MockPayGate());
        System.out.println("주문 결과 : " + devService.주문(1000));

        System.out.println();

        // 백엔드 완성 후 : 진짜로 갈아끼우기 (OrderService 코드는 그대로!)
        System.out.println("== 배포 (Real) ==");
        OrderService realService = new OrderService(new RealPayGate());
        System.out.println("주문 결과 : " + realService.주문(1000));
    }
}
