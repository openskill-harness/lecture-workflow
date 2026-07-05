package com.example.member;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Repository;

/**
 * DB/JPA 없이 동작하는 in-memory 저장소.
 * 이 레슨의 초점은 "요청 매핑부터 응답까지"이지 영속성이 아니므로 Map으로 단순화한다.
 * 영상에서는 아래 세 메서드의 시그니처만 호출한다(구현은 설명 대상 아님).
 */
@Repository
public class MemberRepository {

    private final Map<Long, Member> store = new ConcurrentHashMap<>();
    private final AtomicLong sequence = new AtomicLong(0);

    /** id를 자동 증가시켜 저장하고, id가 채워진 Member를 돌려준다. */
    public Member save(Member member) {
        Long id = sequence.incrementAndGet();
        Member saved = new Member(id, member.email(), member.name());
        store.put(id, saved);
        return saved;
    }

    /** 같은 이메일이 이미 저장되어 있는지 여부 — 중복 가입 규칙의 근거. */
    public boolean existsByEmail(String email) {
        return store.values().stream()
                .anyMatch(m -> m.email().equals(email));
    }

    public Optional<Member> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }
}
