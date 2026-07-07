package ex09.polling;

// [패턴 미적용] 구독/알림(push) 대신, 손님이 1초마다 직접 물어본다(polling).
// 주기 설정이 애매하고 낭비가 크다(옵저버 push로 바꾸면 입고 즉시 통지).
/**
 * 1. 주기적으로 잘 물어보고
 * 2. 실시간으로 반응하려고!!
 * 3. 주기를 잘 정해야함.
 */
public class App {
    public static void main(String[] args) {
        LotteMart lotteMart = new LotteMart();
        Customer1 cus1 = new Customer1();
        
        // 1. 마트 입고 준비 (마트 스레드)
        new Thread(() ->{
            lotteMart.received();
        }).start();

        // 2. 손님1 (손님 스레드 = main 스레드)
        while(true){
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                throw new RuntimeException(e);
            }
            if(lotteMart.getValue() != null){
                cus1.update(lotteMart.getValue()+"가 들어왔습니다");

            }else{
                System.out.println("상품이 아직 들어오지 않았어요");
            }
        }
    }
}
