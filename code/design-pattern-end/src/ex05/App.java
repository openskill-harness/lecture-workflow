package ex05;


import ex05.lib.OuterRabbit;

public class App {
    public static void main(String[] args) {
        Animal rabbit = new RabbitAdapter(new OuterRabbit());
        Doorman doorman = new Doorman();
        doorman.쫒아내(rabbit);
    }
}
