package ex10;

import ex10.notification.BasicEmail;
import ex10.notification.BasicNotifier;
import ex10.notification.BasicSms;
import ex10.notification.BasicSmsEmail;

/**
 * 목표 : 기능확장 (데코레이터 미적용) -> 알림서비스 개발하기
 * [패턴 미적용] 조합마다 클래스를 따로 만들다 보니 알림 종류가 늘어날 때마다 클래스 수가 기하급수로 늘어난다.
 */
public class App {
    public static void main(String[] args) {
        // 1. 기본 알림
        new BasicNotifier().send();
        System.out.println("__end");

        // 2. 기본 알림 + 문자 알림
        new BasicSms().send();
        System.out.println("__end");

        // 3. 기본 알림 + 이메일 알림
        new BasicEmail().send();
        System.out.println("__end");

        // 4. 기본 알림 + 문자 알림 + 이메일 알림
        new BasicSmsEmail().send();
        System.out.println("__end");
    }
}
