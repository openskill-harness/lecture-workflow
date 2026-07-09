package ex08;

import ex08.student.HomeworkManager;
import ex08.student.HomeworkType;

public class App {
    public static void main(String[] args) {
        HomeworkManager manager = new HomeworkManager();

        manager.doHomework(HomeworkType.MATH);
        manager.doHomework(HomeworkType.SCIENCE);
        manager.doHomework(HomeworkType.HISTORY);
    }
}
