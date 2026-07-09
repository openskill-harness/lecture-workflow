package ex16.ref02;

import java.lang.reflect.Method;

/**
 * ch02 - 어노테이션 + 리플렉션으로 한계 돌파
 *
 * ch01 의 if-else 분기표가 통째로 사라졌다.
 * App 은 더 이상 "무슨 uri 에 무슨 메서드"를 알지 못한다.
 * 대신 리플렉션으로 컨트롤러의 메서드들을 훑고, @RequestMapping 의 uri 가
 * 요청과 같으면 그 메서드를 호출(invoke)한다.
 *
 * => BoardController 에 새 메서드를 아무리 추가해도 이 App 은 절대 바뀌지 않는다.
 *    이것이 라이브러리(내가 부른다) -> 프레임워크(프레임워크가 나를 부른다)로의 전환.
 */
public class App {
    public static void main(String[] args) {
        // 클라이언트가 보낸 요청 주소라고 가정
        String uri = "/update";

        BoardController boardController = new BoardController();

        // 컨트롤러가 가진 모든 메서드를 런타임에 조사한다.
        Method[] methods = boardController.getClass().getDeclaredMethods();
        for (Method method : methods) {
            RequestMapping rm = method.getDeclaredAnnotation(RequestMapping.class);

            // @RequestMapping 이 안 붙은 메서드면 null -> 건너뛴다 (NPE 방지)
            if (rm == null) {
                continue;
            }

            // 외부에서 들어온 uri 와 어노테이션의 uri 가 같으면 그 메서드를 호출
            if (rm.uri().equals(uri)) {
                try {
                    method.invoke(boardController); // 리플렉션으로 호출
                    break;
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}
