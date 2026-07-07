package ex13;

import ex13.lib.DB;
import ex13.lib.Driver;
import ex13.lib.MariaDB;
import ex13.lib.OracleDB;

public class DBFactory {

    private static DBFactory instance = new DBFactory();

    private DBFactory(){}

    public static DBFactory getInstance(){
        return instance;
    }

    // 단점: OCP 위배
    // 책임 : new를 대신해준다.
    public DB createDB(Driver driver){
        // TODO: driver.getProtocol()이 "maria"면 MariaDB, "oracle"이면 OracleDB를 생성하고
        //       각자 setUrl(...) 후 반환하세요. 없으면 예외를 던지세요.
        return null;
    }
}
