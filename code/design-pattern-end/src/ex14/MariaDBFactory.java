package ex14;

// 마리아DB 전용 공장 : 생성 + 접속 URL 세팅까지 책임진다
// (ex12에서 if(maria){...} 분기가 하던 일을 이 클래스 하나가 담당)
public class MariaDBFactory extends DBFactory {
    @Override
    public DB 생성() {
        MariaDB mariaDB = new MariaDB();
        mariaDB.setUrl("jdbc:mariadb://127.0.0.1:3306"); // ex12의 maria 분기와 동일
        return mariaDB;
    }
}
