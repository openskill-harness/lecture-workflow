package ex14;

/**
 * 목표 : 팩토리 메서드 패턴 (Factory Method)
 *
 * 핵심 : "무엇을 만들지"는 자식(서브클래스)이 정한다.
 *        부모는 만드는 '틀'만 정해두고, 실제 생성은 자식 팩토리가 책임진다.
 *
 * ex12(Simple Factory)와 비교 (제품 DB/MariaDB/OracleDB는 완전히 동일) :
 *   - Simple Factory : createDB() 안 if-else 에서 new + setUrl 을 했다. (새 DB → if 추가, OCP 위반)
 *   - Factory Method : if-else 가 사라지고, new + setUrl 을 각 서브클래스 팩토리가 맡는다.
 *   → 달라진 건 '팩토리 구조'뿐, 만들어지는 DB와 접속 URL은 ex12와 똑같다.
 */
public abstract class DBFactory {

    // ↓ 이것이 '팩토리 메서드' : 무엇을 만들지는 자식이 결정한다
    public abstract DB 생성();

    // 생성 후 공통으로 처리할 흐름 (부모가 정해둔 틀)
    public DB 준비() {
        DB db = 생성();
        System.out.println("DB 연결 완료");
        return db;
    }
}
