package ex13;

import ex13.lib.MariaDB;

// [패턴 미적용] 객체 생성(new + setUrl 세팅)을 사용하는 쪽(App)이 직접 한다.
// 같은 생성 코드가 여러 곳에 흩어지고, DB 종류가 늘면 App들을 다 고쳐야 한다(팩토리로 한 곳에 모음).
public class App {
    public static void main(String[] args) {
        MariaDB db = new MariaDB();
        db.setUrl("jdbc:mariadb://127.0.0.1:3306");  // 생성 세부를 App이 떠안음
        db.execute("select");
    }
}
