package ex14;

// end(ex14)의 MariaDB와 동일한 제품
public class MariaDB implements DB {

    private String path;

    // DBMS 서버 접속 URL 세팅
    @Override
    public void setUrl(String path) {
        this.path = path;
    }

    // SQL 실행 (1 성공, -1 실패)
    @Override
    public int execute(String sql) {
        if (path == null) {
            System.out.println("path : null point error");
            return -1;
        }
        if (sql.equals("select")) {
            System.out.println("query execute : " + path + "/" + sql);
            return 1;
        } else {
            System.out.println("query fail : syntax error");
            return -1;
        }
    }
}
