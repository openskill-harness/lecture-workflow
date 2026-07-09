package ex16.ref03;

import java.io.File;
import java.lang.reflect.Method;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

/**
 * ch03 - 패키지 스캔 (DispatcherServlet 의 축소판) * 시연용 *
 *
 * ch02 에서는 우리가 BoardController 를 new 로 직접 만들었다.
 * 여기서는 그것마저 프레임워크가 대신한다:
 *   1) 패키지 폴더 안의 .class 파일을 전부 훑는다.
 *   2) 그 중 @Controller 가 붙은 클래스만 골라 객체로 만든다(자동 등록).
 *   3) 요청 uri 가 오면 등록된 컨트롤러들의 @RequestMapping 을 뒤져 메서드를 호출한다.
 *
 * => 개발자는 @Controller, @RequestMapping 만 붙이면 된다.
 *    "어노테이션만 달았는데 연결됐다"의 실체 = 스프링 컴포넌트 스캔 + 핸들러 매핑.
 *
 * (주의) 이 코드는 IDE/빌드로 .class 가 생성된 상태에서 동작한다.
 */
public class App {

    public static void main(String[] args)
            throws URISyntaxException, ClassNotFoundException, InstantiationException, IllegalAccessException {

        // 1) 패키지를 스캔해 @Controller 객체들을 자동 등록
        List<Object> instances = componentScan("ex16/ref03");

        System.out.println("--------------------------------");

        // 2) 요청 uri 로 등록된 컨트롤러들에서 메서드를 찾아 호출
        findUri(instances, "/delete");
    }

    // 패키지 폴더의 .class 를 훑어 @Controller 가 붙은 클래스만 객체로 만들어 반환
    public static List<Object> componentScan(String packagePath)
            throws URISyntaxException, ClassNotFoundException, InstantiationException, IllegalAccessException {

        // 이 패키지(ex16/ref03) 폴더 위치를 클래스로더에게 물어본다.
        ClassLoader classLoader = Thread.currentThread().getContextClassLoader();
        URL packageUrl = classLoader.getResource(packagePath);

        File packageDir = new File(packageUrl.toURI());

        List<Object> instances = new ArrayList<>();

        // 폴더 안의 파일을 전부 순회
        String basePackage = packagePath.replace('/', '.');
        File[] files = packageDir.listFiles();
        for (File file : files) {
            System.out.println("파일명: " + file.getName());

            // .class 파일만 대상으로 삼는다
            if (file.getName().endsWith(".class")) {
                // 파일명 -> 정규 클래스명 (예: BoardController.class -> ex16.ref03.BoardController)
                String className = basePackage + "." + file.getName().replace(".class", "");
                Class<?> cls = Class.forName(className);

                // @Controller 가 붙은 클래스만 골라 객체로 만든다(자동 등록)
                if (cls.isAnnotationPresent(Controller.class)) {
                    System.out.println("어노테이션이 있는 클래스 : " + file.getName());
                    Object instance = cls.newInstance(); // 객체 생성
                    instances.add(instance);
                }
            }
        }

        return instances;
    }

    // uri 를 비교해 매칭되는 메서드를 리플렉션으로 호출
    public static void findUri(List<Object> instances, String uri) {
        for (Object instance : instances) {
            Method[] methods = instance.getClass().getDeclaredMethods();
            for (Method method : methods) {
                RequestMapping rm = method.getDeclaredAnnotation(RequestMapping.class);

                // @RequestMapping 이 없는 메서드는 건너뛴다 (NPE 방지)
                if (rm == null) {
                    continue;
                }

                if (rm.uri().equals(uri)) {
                    try {
                        method.invoke(instance);
                        break;
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }
        }
    }
}
