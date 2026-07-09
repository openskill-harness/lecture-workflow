package ex12;

/**
 * 가짜 결제 (개발용 Mock)
 *
 * 진짜 결제 서버가 아직 없어도, 프론트 팀은 이걸로 개발/테스트를 바로 시작한다.
 * 항상 성공했다고 응답한다. (원하는 상황을 마음대로 흉내낼 수 있음)
 */
public class MockPayGate implements PayGate {
    @Override
    public boolean 결제(int amount) {
        System.out.println("[가짜] 결제한 척 성공 : " + amount + "원");
        return true;
    }
}
