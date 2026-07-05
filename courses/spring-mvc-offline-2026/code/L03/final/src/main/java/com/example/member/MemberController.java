package com.example.member;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * step-05 (final) — 응답까지 완성.
 * 성공: 201 Created + 응답 DTO. 중복: @ExceptionHandler가 409 Conflict로 매핑.
 * "요청 매핑부터 응답까지"의 마지막 조각 — 응답은 데이터만이 아니라 결과의 의미(상태 코드)를 담는다.
 */
@RestController
public class MemberController {

    private final MemberService memberService;

    public MemberController(MemberService memberService) {
        this.memberService = memberService;
    }

    @PostMapping("/members")
    public ResponseEntity<SignUpResponse> signUp(@RequestBody SignUpRequest request) {
        Member member = memberService.signUp(request);
        SignUpResponse response = new SignUpResponse(member.id(), member.email());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<String> handleDuplicateEmail(DuplicateEmailException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }
}
