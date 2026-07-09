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
    public DB createDB(Driver driver){ // maria, oracle, mysql, mssql
        if(driver.getProtocol().equals("maria")){
            MariaDB mariaDB = new MariaDB();
            mariaDB.setUrl("jdbc:mariadb://127.0.0.1:3306");
            return mariaDB;
        }else if(driver.getProtocol().equals("oracle")){
            OracleDB oracleDB = new OracleDB();
            oracleDB.setUrl("jdbc:oracle:thin://127.0.0.1:8080");
            return oracleDB;
        }else{
            throw new NullPointerException("db driver not found exception");
        }
    }
}
