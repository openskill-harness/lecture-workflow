package com.example.member;

/**
 * step-05 — 중복 가입을 도메인 의미가 담긴 예외로 표현한다.
 * IllegalStateException(범용) 대신 이 예외를 던져야 @ExceptionHandler가
 * "중복"만 골라 409 Conflict로 매핑할 수 있다.
 */
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String email) {
        super("이미 가입된 이메일입니다: " + email);
    }
}
