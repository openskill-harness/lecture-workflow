package ex05;

import ex05.lib.OuterRabbit;

// [패턴 미적용] 외부 타입(OuterRabbit)이 Animal이 아니라서, 문지기가 직접 그 타입을 알아야 한다.
// 외부 타입이 늘 때마다 Doorman에 오버로드를 계속 추가해야 한다(어댑터로 감싸면 해결).
public class Doorman {
    public void 쫒아내(Animal a){
        System.out.println(a.getName()+" 쫒아내");
    }
    public void 쫒아내(OuterRabbit r){          // 외부 타입 전용 오버로드(땜질)
        System.out.println(r.getFullname()+" 쫒아내");
    }
}
