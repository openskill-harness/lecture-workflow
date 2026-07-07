package ex14;

// [패턴 미적용] 한 팩토리가 if-else로 무엇을 만들지 직접 분기한다(Simple Factory).
// 새 DB가 생기면 이 if-else를 고쳐야 한다 → OCP 위반(팩토리 메서드로 서브클래스에 위임하면 해결).
public class DBFactory {
    public DB 준비(String 종류) {
        DB db;
        if (종류.equals("maria")) {
            MariaDB m = new MariaDB();
            m.setUrl("jdbc:mariadb://127.0.0.1:3306");
            db = m;
        } else if (종류.equals("oracle")) {
            OracleDB o = new OracleDB();
            o.setUrl("jdbc:oracle:thin://127.0.0.1:8080");
            db = o;
        } else {
            throw new IllegalArgumentException("모르는 DB");
        }
        System.out.println("DB 연결 완료");
        return db;
    }
}
