package ex16.ref02;


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
