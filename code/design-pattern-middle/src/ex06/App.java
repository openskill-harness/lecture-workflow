package ex06;

public class App {
    public static void main(String[] args) {
        Doorman d1 = new Doorman();
        Doorman d2 = new Doorman();   // 또 만들어짐 — 서로 다른 인스턴스
        System.out.println("같은 인스턴스인가? " + (d1 == d2));  // false
        d1.쫒아내(new Tiger());
    }
}
