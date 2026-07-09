package ex15.after;

public class App {
    public static void main(String[] args) {
        CoffeeFactory factory = new CoffeeFactory();
        System.out.println(factory.만들기("라떼"));

        // 새 커피(콜드브루)가 생겨도, 공장 코드는 안 고친다.  등록만 하면 끝!
        factory.등록("콜드브루", () -> "콜드브루");
        System.out.println(factory.만들기("콜드브루"));
    }
}
