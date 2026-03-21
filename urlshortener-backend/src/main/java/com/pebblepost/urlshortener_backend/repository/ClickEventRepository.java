package com.pebblepost.urlshortener_backend.repository;

import com.pebblepost.urlshortener_backend.model.ClickEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClickEventRepository extends JpaRepository<ClickEvent, Long> {

    Long countByLinkId(Long linkId);

    @Query("SELECT DATE(c.clickedAt) as day, COUNT(c) as clicks " +
            "FROM ClickEvent c " +
            "WHERE c.link.id = :linkId " +
            "GROUP BY DATE(c.clickedAt) " +
            "ORDER BY DATE(c.clickedAt) DESC")
    List<Object[]> findClicksGroupedByDay(@Param("linkId") Long linkId);
}