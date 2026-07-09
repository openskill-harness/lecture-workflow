package ex16.ref03;

/**
 * @Controller 로 "나는 컨트롤러다"라고 선언만 한다.
 * App(프레임워크)이 패키지를 스캔하다가 이 어노테이션을 보고 자동으로 객체를 만든다.
 * 개발자는 App 에 이 클래스를 등록하는 코드를 단 한 줄도 쓰지 않는다.
 */
@Controller
public class BoardController {

    @RequestMapping(uri = "/insert")
    public void insert() {
        System.out.println("insert 호출됨");
    }

    @RequestMapping(uri = "/delete")
    public void delete() {
        System.out.println("delete 호출됨");
    }

    @RequestMapping(uri = "/update")
    public void update() {
        System.out.println("update 호출됨");
    }

    @RequestMapping(uri = "/select")
    public void select() {
        System.out.println("select 호출됨");
    }

    @RequestMapping(uri = "/create")
    public void create() {
        System.out.println("create 호출됨");
    }
}
