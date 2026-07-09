package ex16.ref03;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

@Retention(RetentionPolicy.RUNTIME) // 실행 중에도 어노테이션 정보 유지
@Target(ElementType.METHOD)         // 메서드에만 붙임
public @interface RequestMapping {
    String uri();
}
