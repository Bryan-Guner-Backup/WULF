-- MODULE  DML121  

-- SQL Test Suite, V6.0, Interactive SQL, dml121.sql
-- 59-byte ID
-- TEd Version #

-- AUTHORIZATION FLATER            

   SELECT USER FROM HU.ECCO;
-- RERUN if USER value does not match preceding AUTHORIZATION comment
   ROLLBACK WORK;

-- date_time print

-- TEST:0649 Feature 22, Explicit defaults (static)!

   CREATE TABLE SSSLOG (
   ENTERED_BY CHAR (128) DEFAULT USER,
   SEVERITY INT DEFAULT 1,
   PROBLEM CHAR (40) DEFAULT NULL);
-- PASS:0649 If table is created?

   COMMIT WORK;

   INSERT INTO SSSLOG DEFAULT VALUES;
-- PASS:0649 If 1 row is inserted?

   INSERT INTO SSSLOG VALUES
  (DEFAULT, DEFAULT, DEFAULT);
-- PASS:0649 If 1 row is inserted?

   INSERT INTO SSSLOG VALUES
  (DEFAULT, 3, 'Cross-linked inode');
-- PASS:0649 If 1 row is inserted?

   INSERT INTO SSSLOG VALUES
  ('system', DEFAULT, 'Freed a free frag');
-- PASS:0649 If 1 row is inserted?

   INSERT INTO SSSLOG VALUES
  ('nobody', 6, DEFAULT);
-- PASS:0649 If 1 row is inserted?

   UPDATE SSSLOG SET SEVERITY = DEFAULT
   WHERE PROBLEM LIKE '%inode%';
-- PASS:0649 If 1 row is updated?

   SELECT COUNT(*) FROM SSSLOG WHERE
  ENTERED_BY = 'FLATER' AND SEVERITY = 1
  AND PROBLEM IS NULL;
-- PASS:0649 If count = 2?

   SELECT COUNT(*) FROM SSSLOG WHERE
  ENTERED_BY = 'FLATER' AND SEVERITY = 1
  AND PROBLEM = 'Cross-linked inode';
-- PASS:0649 If count = 1?

   SELECT COUNT(*) FROM SSSLOG WHERE
  ENTERED_BY = 'system' AND SEVERITY = 1
  AND PROBLEM = 'Freed a free frag';
-- PASS:0649 If count = 1?

   SELECT COUNT(*) FROM SSSLOG WHERE
  ENTERED_BY = 'nobody' AND SEVERITY = 6
  AND PROBLEM IS NULL;
-- PASS:0649 If count = 1?

   COMMIT WORK;

   DROP TABLE SSSLOG CASCADE;

   COMMIT WORK;

-- END TEST >>> 0649 <<< END TEST

-- *********************************************

-- TEST:0651 Feature 24, Keyword relaxations (static)!

   CREATE VIEW VERBOSE_PEOPLE AS
  SELECT EMPNAME FROM HU.STAFF AS EMPLOYEES_OF_HU
  WHERE EMPLOYEES_OF_HU.EMPNUM IN
  (SELECT EMPNUM FROM HU.PROJ AS HUPROJ, HU.WORKS
  WHERE PTYPE = 'Design'
  AND HUPROJ.PNUM = HU.WORKS.PNUM);
-- PASS:0651 If view is created?

   COMMIT;
-- PASS:0651 If successful completion?

   GRANT SELECT ON TABLE VERBOSE_PEOPLE TO PUBLIC;
-- PASS:0651 If successful completion?

-- NOTE:0651 Cursor subtest deleted

   ROLLBACK;
-- PASS:0651 If successful completion?

   DROP VIEW VERBOSE_PEOPLE CASCADE;

   COMMIT WORK;

-- END TEST >>> 0651 <<< END TEST

-- *********************************************

-- TEST:0661 Errata:  datetime casting (static)!

   CREATE TABLE LOTSA_DATETIMES (
  C1 DATE, C2 TIME, C3 TIMESTAMP,
  C4 INTERVAL YEAR, C5 INTERVAL MONTH, C6 INTERVAL DAY,
  C7 INTERVAL HOUR, C8 INTERVAL MINUTE, C9 INTERVAL SECOND,
  C10 INTERVAL YEAR TO MONTH,
  C11 INTERVAL DAY TO HOUR,
  C12 INTERVAL DAY TO MINUTE,
  C13 INTERVAL DAY TO SECOND,
  C14 INTERVAL HOUR TO MINUTE,
  C15 INTERVAL HOUR TO SECOND,
  C16 INTERVAL MINUTE TO SECOND);
-- PASS:0661 If table is created?

   COMMIT WORK;

   INSERT INTO LOTSA_DATETIMES VALUES (
  CAST ('1976-06-21' AS DATE),
  CAST ('13:24:00' AS TIME),
  CAST ('1927-11-30 07:10:00' AS TIMESTAMP),
  CAST ('-1' AS INTERVAL YEAR),
  CAST ('+2' AS INTERVAL MONTH),
  CAST ('-3' AS INTERVAL DAY),
  CAST ('4' AS INTERVAL HOUR),
  CAST ('-5' AS INTERVAL MINUTE),
  CAST ('6.333333' AS INTERVAL SECOND),
  CAST ('-5-11' AS INTERVAL YEAR TO MONTH),
  CAST ('2 15' AS INTERVAL DAY TO HOUR),
  CAST ('-3 4:05' AS INTERVAL DAY TO MINUTE),
  CAST ('+6 17:08:09' AS INTERVAL DAY TO SECOND),
  CAST ('-10:45' AS INTERVAL HOUR TO MINUTE),
  CAST ('11:23:45.75' AS INTERVAL HOUR TO SECOND),
  CAST ('-20:00' AS INTERVAL MINUTE TO SECOND));
-- PASS:0661 If 1 row is inserted?

   SELECT COUNT(*) FROM LOTSA_DATETIMES
  WHERE C1 = DATE '1976-06-21' AND
  C2 = TIME '13:24:00' AND
  C3 = TIMESTAMP '1927-11-30 07:10:00.000000' AND
  C4 = INTERVAL -'1' YEAR AND
  C5 = INTERVAL -'-2' MONTH AND
  C6 = INTERVAL '-3' DAY AND
  C7 = INTERVAL '4' HOUR AND
  C8 = INTERVAL -'5' MINUTE AND
  C9 = INTERVAL '6.333333' SECOND AND
  C10 = INTERVAL -'5-11' YEAR TO MONTH AND
  C11 = INTERVAL +'2 15' DAY TO HOUR AND
  C12 = INTERVAL '-3 4:05' DAY TO MINUTE AND
  C13 = INTERVAL '+6 17:08:09.000000' DAY TO SECOND AND
  C14 = INTERVAL '-10:45' HOUR TO MINUTE AND
  C15 = INTERVAL '11:23:45.750000' HOUR TO SECOND;
-- PASS:0661 If count = 1?

   COMMIT WORK;

   DROP TABLE LOTSA_DATETIMES CASCADE;

   COMMIT WORK;

-- END TEST >>> 0661 <<< END TEST

-- *********************************************

-- TEST:0663 Errata:  datetime SQLSTATEs (static)!

   CREATE TABLE WOODCHUCK (
  OBSERVATION DATE,
  WOOD_AGE INTERVAL YEAR TO MONTH);
-- PASS:0663 If table is created?

   COMMIT WORK;

   INSERT INTO WOODCHUCK VALUES (
  CAST ('1994-02-30' AS DATE), NULL);
-- PASS:0663 If ERROR, invalid datetime format, 0 rows inserted?

   INSERT INTO WOODCHUCK VALUES (
  NULL, CAST ('1-12' AS INTERVAL YEAR TO MONTH));
-- PASS:0663 If ERROR, invalid interval format, 0 rows inserted?

   COMMIT WORK;

   DROP TABLE WOODCHUCK CASCADE;

   COMMIT WORK;

-- END TEST >>> 0663 <<< END TEST

-- *************************************************////END-OF-MODULE
