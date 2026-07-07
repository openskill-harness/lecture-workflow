package ex10.notification;

public class SmsNotifier implements Notifier{

    private Notifier notifier;

    public SmsNotifier(Notifier notifier) {
        this.notifier = notifier;
    }

    public SmsNotifier() {
    }

    // 재정의
    public void send(){
        // TODO: 감싼 notifier가 있으면 먼저 send() 호출 후, "문자 알림"을 출력하세요
    }
}
