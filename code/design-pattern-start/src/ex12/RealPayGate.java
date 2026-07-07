package ex12;

/**
 * 진짜 결제 (백엔드 팀이 나중에 완성하는 실제 구현)
 *
 * 프론트 팀 코드는 하나도 안 고치고, 이걸로 갈아끼우기만 하면 된다. (DIP)
 */
public class RealPayGate implements PayGate {
    @Override
    public boolean 결제(int amount) {
        // TODO: amount가 0 이하면 "[진짜] 결제 실패 : 금액 오류"를 출력하고 false,
        //       아니면 "[진짜] 결제 성공 : " + amount + "원"을 출력하고 true를 반환하세요
        return false;
    }
}
