package ex08.student;

import java.util.ArrayList;
import java.util.List;

public class HomeworkDelegator {
    private final List<Student> students = new ArrayList<>();

    // 작업을 위임하기 위해 미리 정의된 학생 객체들을 리스트에 추가
    public HomeworkDelegator(){
        students.add(new MathStudent());
        students.add(new ScienceStudent());
        students.add(new HistoryStudent());
    }

    public void delegateHomework(HomeworkType type){
        // TODO: students 중 type과 일치하는 학생을 찾아 doHomework() 호출
    }
}
