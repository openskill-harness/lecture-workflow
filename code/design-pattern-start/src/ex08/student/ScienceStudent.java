package ex08.student;

public class ScienceStudent implements Student{
    @Override
    public void doHomework() {
        // TODO: "과학 숙제를 합니다" 출력
    }

    @Override
    public boolean isSameHomework(HomeworkType homeworkType) {
        // TODO: homeworkType이 SCIENCE인지 비교해 반환
        return false;
    }
}
