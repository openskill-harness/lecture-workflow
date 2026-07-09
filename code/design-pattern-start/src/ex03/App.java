package ex03;

public class App {
    public static void main(String[] args) {
        Mouse mouse = new Mouse();
        Doorman doorman = new Doorman(mouse);
        doorman.쫓아내();
    }
}
