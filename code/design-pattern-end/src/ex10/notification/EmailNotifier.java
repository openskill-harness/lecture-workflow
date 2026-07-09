package ex10.notification;

public class EmailNotifier implements Notifier{

    private Notifier notifier;

    public EmailNotifier(Notifier notifier) {
        this.notifier = notifier;
    }

    public EmailNotifier() {}

    // 재정의
    public void send(){
        if(notifier != null) notifier.send();
        System.out.println("이메일 알림");
    }
}
