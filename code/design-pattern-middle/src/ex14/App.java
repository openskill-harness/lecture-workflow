package ex14;

public class App {
    public static void main(String[] args) {
        new DBFactory().준비("maria").execute("select");
    }
}
