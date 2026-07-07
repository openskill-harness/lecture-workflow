package ex03;

// [Context] 달라진 곳은 여기뿐!
// 원본은 쫒아내(Animal a)로 매번 받았지만,
// 여기선 전략(Animal)을 "필드로 보유"하고 setter로 갈아끼운다.
public class Doorman {

    private Animal target; // 보유한 전략 (has-a)

    // 런타임에 "쫒아내는 대상/방식"을 갈아끼운다 — 전략패턴의 핵심
    public void setTarget(Animal target) {
        // TODO: 전달받은 전략(target)을 필드에 저장하세요
    }

    // 파라미터 없이, 현재 보유한 전략에게 위임한다
    public void 쫒아내() {
        // TODO: 현재 보유한 전략(target)의 이름으로 "OO 쫒아내"를 출력하세요
    }
}
