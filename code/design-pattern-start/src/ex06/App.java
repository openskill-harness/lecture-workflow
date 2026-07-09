package ex06;

public class App {
    public static void main(String[] args) {
        Doorman doorman1 = new Doorman();
        doorman1.쫓아내(new Tiger());
        doorman1.쫓아내(new Mouse());

        // 다른 곳에서 실수로 또 만들어버리면?
        Doorman doorman2 = new Doorman();
        doorman2.쫓아내(new Tiger());
        // doorman2는 새로 만든 거라 카운트가 1부터 다시 시작한다.
        // 문지기는 하나만 있어야 하는데, 이러면 총 인원수를 믿을 수 없다.
    }
}
