package ex05;

import ex05.lib.OuterRabbit;

public class RabbitAdapter extends Animal{

    private OuterRabbit outerRabbit;

    public RabbitAdapter(OuterRabbit outerRabbit) {
        this.outerRabbit = outerRabbit;
    }

    @Override
    public String getName() {
        // TODO: 어댑터가 감싼 OuterRabbit의 getFullname()을 Animal의 getName()으로 변환해 반환하세요
        return null;
    }
}
