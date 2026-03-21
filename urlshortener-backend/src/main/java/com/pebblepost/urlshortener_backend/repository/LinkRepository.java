package com.pebblepost.urlshortener_backend.repository;

import com.pebblepost.urlshortener_backend.model.Link;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface LinkRepository extends JpaRepository<Link, Long> {

    Optional<Link> findBySlug(String slug);

    Optional<Link> findByTargetUrl(String targetUrl);
}