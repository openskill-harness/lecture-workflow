package ex05;

import ex05.lib.OuterRabbit;

/**
 * 문제 : 외부에서 가져온 토끼(OuterRabbit)는 이름 가져오는 메서드가 getFullname()이라
 *        Doorman이 기대하는 Animal 타입이 아니다. 코드를 고칠 수도 없다.
 */
public class App {
    public static void main(String[] args) {
        Doorman doorman = new Doorman();
        doorman.쫓아내(new Tiger());

        OuterRabbit rabbit = new OuterRabbit();
        // doorman.쫓아내(rabbit); // 컴파일 오류! OuterRabbit은 Animal이 아니다.

        // 어쩔 수 없이 토끼만을 위한 코드를 따로 만든다 (Doorman 로직과 중복)
        System.out.println(rabbit.getFullname() + " 쫓아내");
    }
}
