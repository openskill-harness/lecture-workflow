package com.example.member;

/**
 * 회원 가입 요청 DTO. 컨트롤러의 입구에서 JSON 본문이 이 모양으로 역직렬화된다.
 */
public record SignUpRequest(String email, String name) {
}
