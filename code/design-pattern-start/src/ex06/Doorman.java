package ex06;

/**
 * 문제 : 문지기가 몇 명 쫓아냈는지 세고 싶은데, 아무나 new Doorman()을 하면
 *        인스턴스마다 카운트가 따로 놀아서 전체 숫자를 믿을 수 없다.
 */
public class Doorman {

    private int count = 0;

    public void 쫓아내(Animal a) {
        count++;
        System.out.println(a.getName() + " 쫓아내 (이 문지기 기준 " + count + "번째)");
    }
}
