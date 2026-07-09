package ex16.ref03;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * "이 클래스는 요청을 처리하는 컨트롤러다"라고 표시하는 어노테이션.
 * 프레임워크가 패키지를 스캔하다가 이 표시가 붙은 클래스만 자동으로 등록한다.
 * (스프링의 @Controller / @Component 의 축소판)
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.TYPE) // 클래스에 붙임
public @interface Controller {
}
