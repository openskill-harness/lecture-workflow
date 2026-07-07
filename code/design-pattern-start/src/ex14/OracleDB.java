package ex14;

// ex12(Simple Factory)의 OracleDB와 동일한 제품
public class OracleDB implements DB {

    private String url;

    // DBMS 서버 접속 URL 세팅
    @Override
    public void setUrl(String url) {
        this.url = url;
    }

    // SQL 실행 (1 성공, -1 실패)
    @Override
    public int execute(String sql) {
        if (url == null) {
            System.out.println("url : null point error");
            return -1;
        }
        if (sql.equals("select")) {
            System.out.println("query execute : " + url + "/" + sql);
            return 1;
        } else {
            System.out.println("query fail : syntax error");
            return -1;
        }
    }
}
