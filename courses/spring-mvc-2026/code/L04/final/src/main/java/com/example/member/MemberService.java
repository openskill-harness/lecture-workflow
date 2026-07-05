package com.example.member;

import org.springframework.stereotype.Service;

/**
 * step-05 — 가입 규칙은 그대로 서비스에 있다.
 * 달라진 점: 중복일 때 범용 IllegalStateException 대신 도메인 예외
 * DuplicateEmailException을 던진다(컨트롤러가 409로 매핑할 수 있도록).
 */
@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new DuplicateEmailException(request.email());
        }
        return memberRepository.save(new Member(null, request.email(), request.name()));
    }
}
