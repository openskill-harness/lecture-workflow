package ex12;

/**
 * 결제 게이트 '계약(인터페이스)'
 *
 * 이 인터페이스만 먼저 합의하면,
 *  - 프론트(주문 로직) 팀은 '가짜(Mock)'로 개발을 시작하고
 *  - 백엔드(결제) 팀은 '진짜(Real)'를 동시에 만든다.  ← 병렬 개발
 */
public interface PayGate {
    // 결제 성공하면 true, 실패하면 false
    boolean 결제(int amount);
}
