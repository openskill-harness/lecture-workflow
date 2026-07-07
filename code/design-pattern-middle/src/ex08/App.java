package ex08;

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
