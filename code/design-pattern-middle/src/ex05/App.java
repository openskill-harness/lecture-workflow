package ex05;

import ex05.lib.OuterRabbit;

public class App {
    public static void main(String[] args) {
        Doorman doorman = new Doorman();
        doorman.쫒아내(new OuterRabbit());
    }
}
