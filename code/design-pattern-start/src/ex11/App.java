package ex11;

public class App {
    public static void main(String[] args) {
        MeterService ms = new MeterService(new RealMeter());

        try {
            ms.render();
        } catch (UnsupportedOperationException e) {
            System.out.println("화면 개발 중단 : " + e.getMessage());
        }
    }
}
