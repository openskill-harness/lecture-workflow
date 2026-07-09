package ex15.before;

public class App {
    public static void main(String[] args) {
        CoffeeFactory factory = new CoffeeFactory();
        System.out.println(factory.만들기("라떼"));

        // 새 커피(예: 콜드브루)가 생기면?
        // → CoffeeFactory 의 if-else 를 또 열어서 고쳐야 한다. (귀찮고 위험)
    }
}
