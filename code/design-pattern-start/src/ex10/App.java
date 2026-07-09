package ex10;

import ex10.notification.NotificationService;

public class App {
    public static void main(String[] args) {
        NotificationService basic = new NotificationService(false, false);
        basic.send();
        System.out.println("__end");

        NotificationService sms = new NotificationService(true, false);
        sms.send();
        System.out.println("__end");

        NotificationService smsAndEmail = new NotificationService(true, true);
        smsAndEmail.send();
        System.out.println("__end");

        // 이메일을 문자보다 먼저 보내고 싶다면? 순서를 바꿀 방법이 없다.
        // 이메일을 두 번 보내고 싶다면? 그것도 안 된다.
    }
}
