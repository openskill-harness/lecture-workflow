package ex12;

/**
 * 문제 : OrderService가 '진짜' 결제 시스템(PayGate)에 직접 의존하고 있어서,
 *        결제팀이 다 만들 때까지 주문 로직을 개발하지도, 테스트하지도 못한다.
 */
public class OrderService {

    private PayGate payGate;

    public OrderService(PayGate payGate) {
        this.payGate = payGate;
    }

    public boolean 주문(int amount) {
        if (amount <= 0) {
            return false;
        }
        return payGate.결제(amount);
    }
}
