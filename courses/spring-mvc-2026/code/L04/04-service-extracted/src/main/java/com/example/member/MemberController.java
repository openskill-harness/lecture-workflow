package com.example.member;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * step-04 — 책임 분리 후의 컨트롤러.
 * 컨트롤러는 이제 요청 수신·응답 변환만 한다. 가입 규칙은 MemberService가 담당한다.
 * 컨트롤러가 더 이상 MemberRepository를 직접 알지 않는다는 점에 주목.
 */
@RestController
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/members")
    public SignUpResponse signUp(@RequestBody SignUpRequest request) {
        Member member = memberService.signUp(request);
        return new SignUpResponse(member.id(), member.email());
    }
}
