package com.gingerik.bzv.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.NotBlank;

import java.util.HashSet;
import java.util.Set;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.Min;
import javax.validation.constraints.Size;

@Entity
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Min(2000)
  private int year;

  @NotBlank
  private String name;

  @Email
  @NotBlank
  private String email;

  @JsonIgnore
  @NotBlank
  @Size(min = 60, max = 60)
  // TODO regex
  // TODO setter, i.e. password -> hash
  private String hash;

  private Set<Vote> votes = new HashSet<Vote>();

  private User() {
  }

  /**
   * Create a new User.
   * @param year Year of season
   * @param name Name
   * @param email Email address
   * @param hash Password hash
   */
  public User(int year, String name, String email, String hash) {
    this.year = year;
    this.name = name;
    this.email = email;
    setHash(hash);
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

  public void setEmail(String email) {
    this.email = email;
  }

  public String getEmail() {
    return email;
  }

  public void setHash(String hash) {
    this.hash = hash;
  }

  private String getHash() {
    return hash;
  }

  private void setVotes(Set<Vote> votes) {
    this.votes = votes;
  }

  // TODO unmodifiable set (pp 44)
  public Set<Vote> getVotes() {
    return votes;
  }

  /**
   * Create a bidirectional link with Vote.
   * @param vote Vote
   */
  public void addVote(Vote vote) {
    if (vote == null) {
      throw new NullPointerException("vote cannot be null");
    }
    if (vote.getUser() != null) {
      throw new IllegalStateException("vote is already assigned to a user");
    }
    getVotes().add(vote);
    vote.setUser(this);
  }

}