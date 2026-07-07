package ex12;

/**
 * [패턴 미적용] OrderService 가 RealPayGate 를 직접 만들어 쓴다.
 * 진짜 결제서버 없이는 주문 로직만 따로 테스트할 방법이 없다.
 */
public class App {
    public static void main(String[] args) {
        OrderService service = new OrderService();
        System.out.println("주문 결과 : " + service.주문(1000));
    }
}
