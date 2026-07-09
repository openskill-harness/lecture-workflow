package ex12;

public class App {
    public static void main(String[] args) {
        OrderService service = new OrderService(new PayGate());

        try {
            System.out.println("주문 결과 : " + service.주문(1000));
        } catch (UnsupportedOperationException e) {
            System.out.println("주문 로직 개발 중단 : " + e.getMessage());
        }

        // 결제팀이 완성될 때까지, 주문 로직 자체를 테스트할 방법이 없다.
    }
}
