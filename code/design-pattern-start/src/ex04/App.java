package ex04;

public class App {
    public static void main(String[] args) {
        Doorman doorman = new Doorman();
        doorman.쫓아내(new Tiger());

        // 나이 제한 검사를 추가하고 싶다면? Doorman.쫓아내()를 직접 고쳐야 하는데,
        // 이 클래스는 다른 화면에서도 그대로 쓰고 있어서 위험하다.
    }
}
