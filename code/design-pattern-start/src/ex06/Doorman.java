package ex06;

/**
 * 목적 : 문지기를 메모리에 하나만 올리고 싶다.
 */
public class Doorman {

    // 싱글턴 골격: 인스턴스를 필드에 하나만 만들어 두고 계속 재사용한다.
    public static Doorman instance = new Doorman();

    // 생성자를 private으로 막아 외부에서 new Doorman()을 못 하게 한다.
    private Doorman() {}

    // 동물이면 쫒아내
    public void 쫒아내(Animal a){
        // TODO: a.getName() 으로 "OO 쫒아내"를 출력하세요
    }
}
