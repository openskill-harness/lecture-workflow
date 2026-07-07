package ex07.teacher;

// [패턴 미적용] 입장/출석/퇴장 공통 흐름을 교사마다 복붙한다.
// 공통 흐름이 바뀌면 모든 교사 클래스를 다 고쳐야 한다(템플릿 메서드로 한 곳에 모을 수 있음).
public class JavaTeacher {
    public void 수업하기() {
        System.out.println("입장하기");
        System.out.println("출석부르기");
        System.out.println("자바 강의하기");
        System.out.println("퇴장하기");
    }
}
