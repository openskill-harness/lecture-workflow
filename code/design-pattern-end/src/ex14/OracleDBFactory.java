package ex14;

// 오라클DB 전용 공장 : 생성 + 접속 URL 세팅까지 책임진다
// (ex12에서 else if(oracle){...} 분기가 하던 일을 이 클래스 하나가 담당)
public class OracleDBFactory extends DBFactory {
    @Override
    public DB 생성() {
        OracleDB oracleDB = new OracleDB();
        oracleDB.setUrl("jdbc:oracle:thin://127.0.0.1:8080"); // ex12의 oracle 분기와 동일
        return oracleDB;
    }
}
