package ex04;

// [패턴 미적용] 문지기 본연의 '쫓아내기'에 '지갑 검사'까지 한 메서드에 뒤섞었다.
// 부가기능을 켜고/끄거나 다른 문지기에 재사용할 수 없다(프록시로 분리하면 해결).
public class Doorman {
    public void 쫓아내(Animal a){
        System.out.println("지갑 검사");      // 부가기능이 본체에 박혀버림
        System.out.println(a.getName()+" 쫒아내");
    }
}
