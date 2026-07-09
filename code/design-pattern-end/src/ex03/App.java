package ex03;

public class App {
    public static void main(String[] args) {
        Doorman doorman = new Doorman();

        // 전략 주입
        doorman.setTarget(new Tiger());
        doorman.쫒아내(); // 호랑이 쫒아내

        // ★ 같은 doorman, 같은 쫒아내() 호출인데 전략만 갈아끼움
        doorman.setTarget(new Mouse());
        doorman.쫒아내(); // 쥐 쫒아내
    }
}
