package ex12;

// [패턴 미적용] OrderService가 RealPayGate를 직접 new 한다.
// 진짜 결제서버 없이는 주문 로직만 따로 테스트할 수 없다(PayGate 주입 + Mock으로 해결).
public class OrderService {
    private RealPayGate payGate = new RealPayGate();  // 구현에 직접 의존
    public boolean 주문(int amount) {
        if (amount <= 0) return false;
        return payGate.결제(amount);
    }
}
