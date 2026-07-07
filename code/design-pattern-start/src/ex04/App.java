package ex04;


public class App {
    public static void main(String[] args) {
        Animal mouse = new Mouse();
        Animal tiger = new Tiger();
        DoormanProxy2 doorman = new DoormanProxy2(new Doorman());
        doorman.쫓아내(mouse);
    }
}
