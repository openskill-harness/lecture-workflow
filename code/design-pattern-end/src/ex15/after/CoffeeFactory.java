package ex15.after;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Supplier;

/**
 * [리팩토링 후]  if-else 제거!  메뉴판(Map)에 등록만 하면 끝.
 *
 * 새 커피는 등록() 한 줄로 추가된다.  기존 코드(만들기)는 안 고친다. → OCP 준수
 */
public class CoffeeFactory {

    // 커피이름 → 만드는 방법(레시피)
    private Map<String, Supplier<String>> menu = new HashMap<>();

    public CoffeeFactory() {
        menu.put("아메리카노", () -> "아메리카노");
        menu.put("라떼", () -> "라떼");
        menu.put("모카", () -> "모카");
    }

    // 새 커피는 이 메서드로 등록만 하면 된다 (기존 코드 수정 X)
    public void 등록(String type, Supplier<String> recipe) {
        menu.put(type, recipe);
    }

    public String 만들기(String type) {
        Supplier<String> recipe = menu.get(type);
        if (recipe == null) {
            return "그런 커피 없어요";
        }
        return recipe.get();
    }
}
