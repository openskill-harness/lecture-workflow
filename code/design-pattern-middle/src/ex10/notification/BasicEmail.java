package ex10.notification;

// [패턴 미적용] 알림 조합마다 클래스를 따로 만든다. 조합이 늘면 클래스가 기하급수로 폭발한다.
public class BasicEmail implements Notifier {
    public void send(){
        System.out.println("기본 알림");
        System.out.println("이메일 알림");
    }
}
