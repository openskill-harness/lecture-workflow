package com.example.member;

/**
 * 회원 도메인. 촬영 가독성을 위해 Lombok 없이 record로 둔다.
 * id는 저장 시 MemberRepository가 채운다(신규 저장 전에는 null).
 */
public record Member(Long id, String email, String name) {
}
