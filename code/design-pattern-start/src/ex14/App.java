package ex14;

public class App {
    public static void main(String[] args) {

        // 마리아DB가 필요하면 → 마리아 공장을 쓴다
        DBFactory factory = new MariaDBFactory();
        DB db = factory.준비();
        db.execute("select");

        System.out.println("---------------");

        // 오라클로 바꾸고 싶으면 → 공장만 교체! (if-else 가 없다)
        DBFactory factory2 = new OracleDBFactory();
        DB db2 = factory2.준비();
        db2.execute("select");

        // 새 DB(예: MySQL)가 생기면?
        //  1) MySQL implements DB  클래스 추가
        //  2) MySQLFactory extends DBFactory  클래스 추가
        //  → 기존 코드는 하나도 안 고친다.  ← 이게 팩토리 메서드의 장점
    }
}
