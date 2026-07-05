package com.example.member;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * step-03 — (의도적) 뚱뚱한 컨트롤러.
 * 중복 이메일 검사(가입 규칙)를 컨트롤러 안에 직접 넣었다. 동작은 한다.
 * 하지만 컨트롤러가 "요청을 받는 일"과 "가입 규칙을 판단하는 일"을 동시에 떠안았다 —
 * L03에서 말한 책임 경계가 무너진 상태다. 다음 단계에서 이를 분리한다.
 */
@RestController
public class MemberController {

    private final MemberRepository memberRepository;

    public MemberController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @PostMapping("/members")
    public SignUpResponse signUp(@RequestBody SignUpRequest request) {
        // 비즈니스 규칙이 컨트롤러 안에 들어와 있다.
        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("이미 가입된 이메일입니다: " + request.email());
        }
        Member member = memberRepository.save(new Member(null, request.email(), request.name()));
        return new SignUpResponse(member.id(), member.email());
    }
}
