package ex13;

import ex13.lib.MariaDB;

public class App {
    public static void main(String[] args) {
        MariaDB mariaDB = new MariaDB();
        mariaDB.execute("select");
    }
}
