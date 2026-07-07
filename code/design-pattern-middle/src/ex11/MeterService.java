package ex11;

// [패턴 미적용] MeterService가 RealMeter를 직접 new 한다.
// RealMeter가 아직 없거나 느리면 개발/테스트를 시작조차 못 한다(인터페이스+주입으로 Mock 교체 가능).
public class MeterService {
    private RealMeter meter = new RealMeter();   // 구현에 직접 의존
    public void render(){
        System.out.println("걸음 수 : " + meter.getStep());
    }
}
