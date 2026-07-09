package ex15.before;

/**
 * [리팩토링 전]  if-else 지옥
 *
 * 문제 : 새 커피가 생길 때마다 이 만들기() 안의 if-else 를 계속 고쳐야 한다.
 *        (수정에 열려있음 → OCP 위반, 유지보수 어려움)
 */
public class CoffeeFactory {

    public String 만들기(String type) {
        if (type.equals("아메리카노")) {
            return "아메리카노";
        } else if (type.equals("라떼")) {
            return "라떼";
        } else if (type.equals("모카")) {
            return "모카";
        } else {
            return "그런 커피 없어요";
        }
    }
}
