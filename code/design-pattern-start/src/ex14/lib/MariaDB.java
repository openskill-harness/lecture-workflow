package ex14.lib;

public class MariaDB implements DB{

    private String path;

    // SQL 쿼리 전송 (1은 성공, -1은 실패)
    public int execute(String sql){
        if(path == null) {
            System.out.println("path : null point error");
            return -1;
        }

        if(sql.equals("select")){
            System.out.println("query execute : "+path+"/"+sql);
            return 1;
        }else{
            System.out.println("query fail : syntax error");
            return -1;
        }
    }

    // DBMS 서버 ip 세팅
    public void setUrl(String path){
        this.path = path;
    }
}
