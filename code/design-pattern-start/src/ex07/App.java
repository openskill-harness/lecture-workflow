package ex07;

import ex07.teacher.HTMLTeacher;
import ex07.teacher.JavaTeacher;
import ex07.teacher.PythonTeacher;

/**
 * 문제 : 입장하기/출석부르기/퇴장하기 코드가 선생님 클래스마다 똑같이 반복된다.
 *        출석 부르는 방식을 바꾸고 싶으면 선생님 클래스를 전부 다 고쳐야 한다.
 */
public class App {
    public static void main(String[] args) {
        HTMLTeacher ht = new HTMLTeacher();
        ht.수업하기();

        System.out.println();

        JavaTeacher jt = new JavaTeacher();
        jt.수업하기();

        System.out.println();

        PythonTeacher pt = new PythonTeacher();
        pt.수업하기();
    }
}
