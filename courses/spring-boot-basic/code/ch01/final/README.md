# 1차시 실습코드: Hello Server

이 프로젝트는 1차시 `서버 프로그램과 웹 애플리케이션 실행 환경 이해` 강의에서 사용하는 가장 작은 Spring Boot 웹 서버 예제입니다.

## 실습 목표

- Spring Boot 애플리케이션의 시작점인 `main()` 메서드를 확인한다.
- `@RestController`와 `@GetMapping`으로 `/hello` 요청을 처리한다.
- 브라우저에서 `http://localhost:8080/hello`를 호출해 응답을 확인한다.

## Spring Starter 생성 기준

Spring Tools for Eclipse의 `Spring Starter Project`에서 다음 값으로 생성하는 것을 기준으로 합니다.

| 항목 | 값 |
| --- | --- |
| Project | Gradle - Groovy |
| Language | Java |
| Spring Boot | 4.1.0 |
| Group | `com.example` |
| Artifact | `ch01-hello-server` |
| Packaging | Jar |
| Java | 21 |
| Dependencies | Spring Web MVC |

## 실행 방법

Spring Tools for Eclipse 5.2.0 이상에서 Gradle 프로젝트로 import한 뒤 `Ch01HelloServerApplication`을 `Run As > Spring Boot App`으로 실행합니다.

Gradle Wrapper가 포함되어 있으므로 Windows에서는 다음 명령으로도 실행할 수 있습니다.

```bash
.\gradlew.bat bootRun
```

테스트 실행:

```bash
.\gradlew.bat test
```

## 확인 URL

```text
http://localhost:8080/hello
```

예상 응답:

```text
Hello Spring Boot
```

## 핵심 코드

```java
@RestController
public class HelloController {

    @GetMapping("/hello")
    public String hello() {
        return "Hello Spring Boot";
    }
}
```
