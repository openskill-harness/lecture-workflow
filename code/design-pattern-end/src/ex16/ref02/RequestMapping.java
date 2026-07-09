package ex16.ref02;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * 우리가 직접 만든 어노테이션.
 * 스프링이 파는 "고정된 물건"이 아니라, 규약(어노테이션)을 만들어 두고
 * 개발자가 메서드에 붙이기만 하면 프레임워크가 알아서 연결하게 하는 것이 목표.
 */
@Retention(RetentionPolicy.RUNTIME) // 실행 중(런타임)에도 어노테이션 정보를 읽을 수 있게 유지
@Target(ElementType.METHOD)         // 메서드에만 붙일 수 있음
public @interface RequestMapping {
    String uri(); // uri 속성값 지정: @RequestMapping(uri = "/insert")
}
