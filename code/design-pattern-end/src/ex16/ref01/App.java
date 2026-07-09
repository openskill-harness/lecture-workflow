package ex16.ref01;

/**
 * ch01 - 디자인 패턴의 한계 (출발점)
 *
 * 지금까지 배운 패턴(팩토리 등)은 "내가 가진 코드 안에서" 객체를 유연하게
 * 엮는 방법이었다. 하지만 아래처럼 "어떤 요청(uri)에 어떤 메서드를 연결할지"는
 * 여전히 내가 if-else 로 직접 짜야 한다.
 *
 * => 기능(uri)이 하나 늘 때마다 이 App 을 계속 고쳐야 한다.
 *    "확장에는 열려있고 변경에는 닫혀있어야 한다(OCP)"를 위반.
 *    팩토리 패턴을 끼워넣어도 이 매핑 표는 결국 손으로 관리해야 한다.
 */
public class App {
    public static void main(String[] args) {
        // 클라이언트가 보낸 요청 주소라고 가정
        String uri = "/insert";

        BoardController boardController = new BoardController();

        // [한계] uri -> 메서드 분기를 사람이 직접 나열한다.
        //        새 기능이 생기면 여기 else-if 를 계속 추가해야 한다.
        if (uri.equals("/insert")) {
            boardController.insert();
        } else if (uri.equals("/update")) {
            boardController.update();
        } else if (uri.equals("/delete")) {
            boardController.delete();
        }
    }
}
