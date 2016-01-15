package com.gingerik.bzv.model;

import org.hibernate.validator.constraints.NotBlank;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Entity
public class Peasant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Min(2000)
  private int year;

  @NotBlank
  private String name;

  @OneToMany
  private Set<Candidate> candidates = new HashSet<Candidate>();

  private Peasant() {
  }

  /**
   * Create a new Peasant.
   *
   * @param year Year of season
   * @param name Name
   */
  public Peasant(int year, String name) {
    this.year = year;
    this.name = name;
  }

  public void setYear(int year) {
    this.year = year;
  }

  public int getYear() {
    return year;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getName() {
    return name;
  }

  private void setCandidates(Set<Candidate> candidates) {
    this.candidates = candidates;
  }

  // TODO unmodifiable set (pp 44)
  public Set<Candidate> getCandidates() {
    return candidates;
  }

  /**
   * Create a bidirectional link with Candidate.
   * @param candidate Candidate
   */
  public void addCandidate(Candidate candidate) {
    if (candidate == null) {
      throw new NullPointerException("candidate cannot be null");
    }
    if (candidate.getPeasant() != null) {
      throw new IllegalStateException("candidate is already assigned to a peasant");
    }
    getCandidates().add(candidate);
    candidate.setPeasant(this);
  }

}