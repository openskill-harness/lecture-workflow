package ex11;

/**
 * 문제 : MeterService가 '진짜' 만보기(RealMeter)에 직접 의존하고 있어서,
 *        하드웨어 담당자가 완성할 때까지 이 화면을 개발하지도, 테스트하지도 못한다.
 */
public class MeterService {

    private RealMeter meter;

    public MeterService(RealMeter meter) {
        this.meter = meter;
    }

    public void render() {
        int step = meter.getStep();
        System.out.println("걸음 수 : " + step);
    }
}
