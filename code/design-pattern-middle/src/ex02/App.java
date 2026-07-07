package ex02;

public class App {
    public static void main(String[] args) {
        AreaCalculator calc = new AreaCalculator();
        System.out.println("넓이 : " + calc.넓이("사각형", 4, 5));
        System.out.println("넓이 : " + calc.넓이("원", 3, 0));
        // 삼각형이 필요하면? AreaCalculator.넓이()의 if-else를 또 고쳐야 한다. ← OCP 위반
    }
}
