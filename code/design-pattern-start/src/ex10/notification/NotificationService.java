package ex10.notification;

/**
 * 문제 : 알림 순서를 바꾸거나(이메일을 문자보다 먼저 보내기), 같은 알림을 두 번 보내고
 *        싶으면 이 클래스를 계속 뜯어고쳐야 한다.
 */
public class NotificationService {

    private boolean useSms;
    private boolean useEmail;

    public NotificationService(boolean useSms, boolean useEmail) {
        this.useSms = useSms;
        this.useEmail = useEmail;
    }

    public void send() {
        System.out.println("기본 알림");
        if (useSms) {
            System.out.println("문자 알림");
        }
        if (useEmail) {
            System.out.println("이메일 알림");
        }
    }
}
