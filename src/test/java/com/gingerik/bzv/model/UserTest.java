package com.gingerik.bzv.model;

import org.junit.BeforeClass;
import org.junit.Test;

import java.util.Set;
import javax.validation.ConstraintViolation;
import javax.validation.Validation;
import javax.validation.Validator;
import javax.validation.ValidatorFactory;

import static org.junit.Assert.assertEquals;

public class UserTest {

  private static Validator validator;
  public final static String EMAIL = "email@foo.bar";
  public final static String HASH = "$2a$10$TwentytwocharactersaltThirtyonecharacterspasswordhash";

  @BeforeClass
  public static void setUp() {
    ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
    validator = factory.getValidator();
  }

  @Test()
  public void nameNotNull() {
    User user = new User(2000, null, EMAIL, HASH);

    Set<ConstraintViolation<User>> constraintViolations =
        validator.validate(user);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test()
  public void emailNotNull() {
    User user = new User(2000, "User", null, HASH);

    Set<ConstraintViolation<User>> constraintViolations =
        validator.validate(user);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be empty",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test()
  public void hashNotNull() {
    User user = new User(2000, "User", EMAIL, null);

    Set<ConstraintViolation<User>> constraintViolations =
        validator.validate(user);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "may not be null",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void yearTooLow() {
    User user = new User(1900, "User", EMAIL, HASH);

    Set<ConstraintViolation<User>> constraintViolations =
        validator.validate(user);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "must be greater than or equal to 2000",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void nameMinSize() {
    User user = new User(2000, "", EMAIL, HASH);

    Set<ConstraintViolation<User>> constraintViolations =
        validator.validate(user);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "size must be between 2 and 255",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void emailNotValid() {
    User user = new User(2000, "User", "dummy", HASH);

    Set<ConstraintViolation<User>> constraintViolations =
        validator.validate(user);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "not a well-formed email address",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void hashNotValid() {
    User user = new User(2000, "User", EMAIL, "password");

    Set<ConstraintViolation<User>> constraintViolations =
        validator.validate(user);

    assertEquals(1, constraintViolations.size());
    assertEquals(
        "size must be between 60 and 60",
        constraintViolations.iterator().next().getMessage()
    );
  }

  @Test
  public void userIsValid() {
    User user = new User(2000, "User", EMAIL, HASH);

    Set<ConstraintViolation<User>> constraintViolations =
        validator.validate(user);

    assertEquals(0, constraintViolations.size());
  }
}