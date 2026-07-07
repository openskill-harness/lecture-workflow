package ex03;

// [패턴 미적용] 쫒아낼 대상을 문자열로 받아 if-else로 분기한다.
// 새 동물이 생기면 이 메서드를 고쳐야 하고, 런타임에 '전략'을 갈아끼울 수 없다.
public class Doorman {
    public void 쫒아내(String 동물) {
        if (동물.equals("호랑이")) {
            System.out.println("호랑이 쫒아내");
        } else if (동물.equals("쥐")) {
            System.out.println("쥐 쫒아내");
        } else {
            System.out.println("모르는 동물");
        }
    }
}
