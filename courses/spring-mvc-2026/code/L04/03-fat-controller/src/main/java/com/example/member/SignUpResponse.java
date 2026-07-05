package com.example.member;

/**
 * 회원 가입 응답 DTO. 컨트롤러의 출구에서 이 모양으로 직렬화되어 나간다.
 * 도메인(Member) 전체가 아니라 응답에 필요한 필드만 노출한다.
 */
public record SignUpResponse(Long id, String email) {
}
