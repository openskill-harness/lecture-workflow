package ex01.example;

/**
 * ch01 과제 예시 답안 — 나만의 추상 타입으로 동적바인딩 구현
 *
 * 조건 1: 추상 클래스에 추상 메서드 1개 이상  → Animal.sound()
 * 조건 2: 구현 클래스 2개가 각자 재정의         → Dog, Cat
 * 조건 3: main에서 반드시 "부모 타입 변수"로 호출 → Animal a = new Dog();
 *
 * 도메인은 자유 선택이며, 여기서는 동물(Animal ← Dog/Cat)로 구현했다.
 */

abstract class Animal { // new x
    abstract void sound();
}

class Dog extends Animal {
    @Override // 재정의
    void sound() {
        System.out.println("멍멍");
    }
}

class Cat extends Animal {
    @Override // 재정의
    void sound() {
        System.out.println("야옹");
    }
}

public class App {

    public static void main(String[] args) {
        // 부모 타입 변수에 자식 객체를 담아 호출 → 실행 시점에 실제 객체의 재정의 메서드가 선택된다.
        Animal a = new Dog();
        a.sound(); // 멍멍

        Animal b = new Cat();
        b.sound(); // 야옹

        // 심화(선택): 구현 클래스를 하나 더 추가해도(예: Cow) 위 호출 방식은 바뀌지 않는다.
    }
}
