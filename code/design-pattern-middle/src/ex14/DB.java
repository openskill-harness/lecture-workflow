package ex14;

// 만들어질 제품(Product) — end(ex14)와 동일한 인터페이스
public interface DB {
    void setUrl(String url);   // DBMS 서버 접속 URL 세팅
    int execute(String sql);   // SQL 실행 (1 성공, -1 실패)
}
