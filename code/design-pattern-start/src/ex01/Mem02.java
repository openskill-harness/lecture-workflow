package ex01;

/**
 * 목표 : 다형성, 동적 바인딩 감 잡기
 */
abstract class Instrument {
    abstract void play();
}

class Guitar extends Instrument {
    @Override
    void play() {
        System.out.println("기타를 연주한다");
    }
}

class Piano extends Instrument {
    @Override
    void play() {
        System.out.println("피아노를 연주한다");
    }
}

public class Mem02 {

    public static void main(String[] args) {
        Instrument i1 = new Guitar();
        i1.play();

        Instrument i2 = new Piano();
        i2.play();
    }
}
