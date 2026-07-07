package ex12;

/**
 * 주문 로직 (프론트/비즈니스 팀 담당)
 *
 * 핵심 : 진짜 결제(RealPayGate)를 몰라도 된다. '계약(PayGate)'에만 의존한다.
 *        그래서 백엔드가 완성되기 전에도, Mock 으로 먼저 개발/테스트할 수 있다.
 */
public class OrderService {

    private PayGate payGate;

    // 생성자로 결제 수단을 주입받는다 (가짜든 진짜든 갈아끼우기 가능)
    public OrderService(PayGate payGate) {
        this.payGate = payGate;
    }

    // 금액이 0 이하면 주문 자체가 실패, 아니면 결제 결과를 따른다
    public boolean 주문(int amount) {
        // TODO: amount가 0 이하면 false, 아니면 payGate.결제(amount) 결과를 반환하세요
        return false;
    }
}
