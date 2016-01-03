package com.gingerik.bzv.model;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.validation.constraints.AssertTrue;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
public class Period {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Min(2000)
  private int year;

  @NotNull
  private LocalDateTime start;

  @NotNull
  private LocalDateTime end;

  private LocalDateTime reference;

  @Min(1)
  @Max(5)
  private int numberOfVotes;

  private Period() {
  }

  public Period(int year, LocalDateTime start, LocalDateTime end, LocalDateTime reference, int numberOfVotes) {
    this.year = year;
    this.start = start;
    this.end = end;
    this.reference = reference;
    this.numberOfVotes = numberOfVotes;
  }

  @AssertTrue(message = "period dates should be valid")
  private boolean isValid() {
    return end.isAfter(start) &&
        (reference == null || reference.isAfter(end));
  }

  public void setReference(LocalDateTime reference) {
    this.reference = reference;
  }

  public int getYear() {
    return year;
  }

  public LocalDateTime getStart() {
    return start;
  }

  public LocalDateTime getEnd() {
    return end;
  }

  public LocalDateTime getReference() {
    return reference;
  }

  public int getNumberOfVotes() {
    return numberOfVotes;
  }
}