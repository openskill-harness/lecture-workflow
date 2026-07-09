package ex16.ref02;

/**
 * 이제 컨트롤러는 "이 메서드는 이 uri 요청을 처리한다"를 어노테이션으로 선언만 한다.
 * 누가 언제 이 메서드를 부르는지는 신경 쓰지 않는다.
 *   => 헐리우드 원칙: "Don't call us, we'll call you"
 *      (내가 프레임워크를 부르는 게 아니라, 프레임워크가 내 메서드를 불러준다)
 */
public class BoardController {


    public void insert() {
        System.out.println("insert 호출됨");
    }


    public void delete() {
        System.out.println("delete 호출됨");
    }


    public void update() {
        System.out.println("update 호출됨");
    }

}
