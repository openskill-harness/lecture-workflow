package ex04;

/**
 * 문제 : 지금은 아무나 그냥 통과시킨다. 나이 제한 검사를 추가하고 싶은데,
 *        이 클래스는 다른 화면에서도 그대로 쓰고 있어서 직접 고치기 조심스럽다.
 */
public class Doorman {

    public void 쫓아내(Animal a) {
        System.out.println(a.getName() + " 쫓아내");
    }
}
