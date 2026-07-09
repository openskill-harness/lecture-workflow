package ex08.student;

/**
 * 문제 : 과목이 늘어날 때마다 이 클래스 안의 if-else를 계속 고쳐야 하고,
 *        한 클래스가 모든 과목의 숙제 방법을 다 알고 있어서 점점 커진다.
 */
public class HomeworkManager {

    public void doHomework(HomeworkType type) {
        if (type == HomeworkType.MATH) {
            System.out.println("수학 숙제를 합니다");
        } else if (type == HomeworkType.SCIENCE) {
            System.out.println("과학 숙제를 합니다");
        } else if (type == HomeworkType.HISTORY) {
            System.out.println("역사 숙제를 합니다");
        } else {
            throw new IllegalArgumentException("모르는 과목 : " + type);
        }
    }
}
