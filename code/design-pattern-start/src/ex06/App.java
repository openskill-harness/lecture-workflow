package ex06;

/**
 * 풀링 : Pooling (객체를 10개 유지하는 기법)
 */
public class App {
    public static void main(String[] args) {
        Animal tiger = new Tiger();
        Doorman doorman = Doorman.instance;
        doorman.쫒아내(tiger);
    }
}
