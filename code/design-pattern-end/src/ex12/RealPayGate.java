package ex12;

/**
 * 진짜 결제 (백엔드 팀이 나중에 완성하는 실제 구현)
 *
 * 프론트 팀 코드는 하나도 안 고치고, 이걸로 갈아끼우기만 하면 된다. (DIP)
 */
public class RealPayGate implements PayGate {
    @Override
    public boolean 결제(int amount) {
        if (amount <= 0) {
            System.out.println("[진짜] 결제 실패 : 금액 오류");
            return false;
        }
        System.out.println("[진짜] 결제 성공 : " + amount + "원");
        return true;
    }
}
