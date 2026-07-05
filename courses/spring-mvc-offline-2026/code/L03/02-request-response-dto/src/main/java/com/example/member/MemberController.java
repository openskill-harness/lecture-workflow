package com.example.member;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * step-02 — 요청/응답 데이터 흐름.
 * 입구: @RequestBody 로 JSON 본문을 SignUpRequest 로 받는다.
 * 출구: 저장 결과를 SignUpResponse DTO 로 돌려준다(도메인 그대로가 아니라 경계에서 모양을 바꾼다).
 */
@RestController
public class MemberController {

    private final MemberRepository memberRepository;

    public MemberController(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    @PostMapping("/members")
    public SignUpResponse signUp(@RequestBody SignUpRequest request) {
        Member member = memberRepository.save(new Member(null, request.email(), request.name()));
        return new SignUpResponse(member.id(), member.email());
    }
}
