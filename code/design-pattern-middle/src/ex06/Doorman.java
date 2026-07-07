package ex06;

// [패턴 미적용] 생성자가 public이라 아무 데서나 new 로 여러 개 만들어진다.
// 하나만 유지하고 싶어도 강제할 방법이 없다(싱글턴으로 막을 수 있음).
public class Doorman {
    public Doorman() {}
    public void 쫒아내(Animal a){
        System.out.println(a.getName()+" 쫒아내");
    }
}
