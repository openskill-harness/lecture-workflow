package ex03;

/**
 * 문제 : 동물 종류가 늘어날 때마다 쫓아내() 안의 instanceof 분기를 계속 고쳐야 한다.
 */
public class Doorman {

    private Mouse mouse;

    public Doorman(Mouse mouse) {
        this.mouse = mouse;
    }

    public void 쫓아내() {
        System.out.println(mouse.getName() + " 쫓아내");
        // 새 동물(예: 토끼)이 생기면? 여기 instanceof 분기를 또 추가해야 한다.
    }
}
