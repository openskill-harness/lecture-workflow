package ex13;

import ex13.lib.DB;
import ex13.lib.Driver;

public class App {
    public static void main(String[] args) {
        DBFactory factory = DBFactory.getInstance();
        DB oralceDB = factory.createDB(Driver.MARIA); // DB, MaraiDB
        oralceDB.execute("select");
    }
}
