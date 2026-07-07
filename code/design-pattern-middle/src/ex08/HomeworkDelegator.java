package ex08;

// [패턴 미적용] 위임 대상 객체 없이, 한 클래스가 모든 과목 숙제를 if-else로 직접 처리한다.
// 새 과목이 생기면 이 메서드를 계속 고쳐야 한다(학생 객체에 위임하면 클래스 추가로 끝).
public class HomeworkDelegator {
    public void delegateHomework(HomeworkType type) {
        if (type == HomeworkType.MATH) {
            System.out.println("수학 숙제를 합니다");
        } else if (type == HomeworkType.SCIENCE) {
            System.out.println("과학 숙제를 합니다");
        } else if (type == HomeworkType.HISTORY) {
            System.out.println("역사 숙제를 합니다");
        }
    }
}
