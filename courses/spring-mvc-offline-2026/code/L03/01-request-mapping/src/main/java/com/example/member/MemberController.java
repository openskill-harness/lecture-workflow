package com.example.member;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * step-01 — 요청 매핑.
 * "POST /members 요청이 오면 이 자바 메서드를 실행하라"는 선언만 한다.
 * DispatcherServlet은 이 선언을 보고 핸들러를 찾는다.
 */
@RestController
public class MemberController {

    @PostMapping("/members")
    public String signUp() {
        return "회원 가입 요청이 도착했습니다.";
    }
}
