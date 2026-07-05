package com.example.member;

import org.springframework.stereotype.Service;

/**
 * step-04 — 책임 분리.
 * step-03에서 컨트롤러 안에 있던 "중복 검사 + 저장"을 그대로 이곳으로 옮겼다.
 * 가입 규칙이 바뀌면 이 클래스만 고친다(웹 형식은 컨트롤러의 몫).
 */
@Service
public class MemberService {

    private final MemberRepository memberRepository;

    public MemberService(MemberRepository memberRepository) {
        this.memberRepository = memberRepository;
    }

    public Member signUp(SignUpRequest request) {
        if (memberRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("이미 가입된 이메일입니다: " + request.email());
        }
        return memberRepository.save(new Member(null, request.email(), request.name()));
    }
}
