package ex02;

// [패턴 미적용] 도형 종류를 if-else로 분기해 넓이를 계산한다.
// 새 도형(삼각형 등)이 생기면 이 메서드를 계속 뜯어고쳐야 한다 → OCP 위반.
public class AreaCalculator {
    public double 넓이(String 종류, double a, double b) {
        if (종류.equals("사각형")) {
            return a * b;
        } else if (종류.equals("원")) {
            return a * a * 3.14;
        } else {
            return 0;
        }
    }
}
