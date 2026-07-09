package ex02;

/**
 * 문제 : 도형 종류가 늘어날 때마다 이 계산 로직의 if-else를 계속 고쳐야 한다.
 */
public class App {
    public static void main(String[] args) {
        String[] types = {"사각형", "원"};
        double[][] values = {{4, 5}, {3, 0}}; // 사각형: 가로/세로, 원: 반지름/(안씀)

        for (int i = 0; i < types.length; i++) {
            System.out.println("넓이 : " + 넓이계산(types[i], values[i][0], values[i][1]));
        }

        // 삼각형이 필요하면? 아래 넓이계산() 안에 else if를 또 추가해야 한다.
    }

    static double 넓이계산(String type, double a, double b) {
        if (type.equals("사각형")) {
            return a * b;
        } else if (type.equals("원")) {
            return a * a * 3.14;
        } else {
            throw new IllegalArgumentException("모르는 도형 : " + type);
        }
    }
}
