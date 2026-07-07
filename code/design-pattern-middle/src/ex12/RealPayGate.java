package ex12;

/**
 * 진짜 결제 (백엔드 팀이 나중에 완성하는 실제 구현)
 *
 * [패턴 미적용] 인터페이스(PayGate)를 구현하지 않는다.
 * OrderService 가 이 클래스에 직접 의존하므로, 나중에 Mock 으로 갈아끼울 수 없다.
 */
public class RealPayGate {
    public boolean 결제(int amount) {
        if (amount <= 0) {
            System.out.println("[진짜] 결제 실패 : 금액 오류");
            return false;
        }
        System.out.println("[진짜] 결제 성공 : " + amount + "원");
        return true;
    }
}
