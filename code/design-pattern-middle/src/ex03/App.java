package ex03;

public class App {
    public static void main(String[] args) {
        Doorman doorman = new Doorman();
        doorman.쫒아내("호랑이");
        doorman.쫒아내("쥐");
        // 새 동물이 생기면 Doorman.쫒아내()의 if-else를 또 고쳐야 한다.
    }
}
