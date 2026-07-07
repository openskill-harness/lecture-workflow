package ex02;

/**
 * 목표 : SOLID 중 OCP (개방-폐쇄 원칙)
 *
 * 핵심 : 새 도형이 생겨도, 계산기(App) 코드는 "수정하지 않는다".
 * (확장에는 열려있고 O, 수정에는 닫혀있다 X)
 *
 * 만약 이렇게 짰다면? (나쁜 예)
 * if (종류.equals("사각형")) return 가로 * 세로;
 * else if (종류.equals("원")) return 반지름 * 반지름 * 3.14;
 * → 삼각형이 생길 때마다 이 if-else 를 계속 뜯어고쳐야 한다. (OCP 위반)
 *
 * 해결 : 각 도형이 스스로 넓이()를 책임지게 한다.이건 DIP이다.
 * 새 도형은 클래스만 "추가"하면 되고, App 은 한 줄도 안 고친다.
 */
public class App {
    public static void main(String[] args) {

        Shape[] shapes = {
                new Rectangle(4, 5),
                new Circle(3)
        };

        for (Shape shape : shapes) {
            System.out.println("넓이 : " + shape.넓이());
        }

        // 삼각형이 필요하면? '삼각형(Triangle) extends Shape' 클래스만 새로 만들면 끝!
        // 아래 App 코드는 전혀 고칠 필요가 없다. ← 이게 바로 OCP
    }
}
