package ex08;

import ex08.student.HomeworkDelegator;
import ex08.student.HomeworkType;

/**
 * 델리게이트
 * 개념 : 객체가 자신이 직접 작업을 수행하지 않고 다른 객체에게 위임
 * 쉬운 설명 : 다른 사람에게 일을 맡김
 *
 * 목표
 * 작접을 직접 수행하지 않고, 그 작접을 위임한다
 *
 * 작업 순서
 * 1. 규칙을 정한다. -> 어떤 과목인지 어떤 결과를 줘야하는지
 * 2. 학생을 고른다. -> 과학 학생, 수학 학생 등
 * 3. 숙제를 시킨다. -> 숙제를 하라고 한다.
 *
 * 사용 이유
 * 효율적 : 직접 하기보다는 잘하는 인원에게 맡기면 빠르고 정확하니깐.
 * 유연성 : 일이 생기면 바로 맡길 수 있고, 새로운 친구에 맞는 숙제를 맡길 수 있다.
 *
 * 기능을 확장하면서 위임할때!!
 */
public class App {
    public static void main(String[] args) {
        HomeworkDelegator homeworkDelegator = new HomeworkDelegator();

        // 1. 수학
        homeworkDelegator.delegateHomework(HomeworkType.MATH);

        // 2. 과학
        homeworkDelegator.delegateHomework(HomeworkType.SCIENCE);

        // 3. 역사
        homeworkDelegator.delegateHomework(HomeworkType.HISTORY);
    }
}
