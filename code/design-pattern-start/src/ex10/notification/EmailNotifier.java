package ex10.notification;

public class EmailNotifier implements Notifier{

    private Notifier notifier;

    public EmailNotifier(Notifier notifier) {
        this.notifier = notifier;
    }

    public EmailNotifier() {}

    // 재정의
    public void send(){
        // TODO: 감싼 notifier가 있으면 먼저 send() 호출 후, "이메일 알림"을 출력하세요
    }
}
