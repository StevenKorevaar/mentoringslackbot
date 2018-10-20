INSERT INTO mentors (ID, Name) VALUES (1, 'Steven');
INSERT INTO mentors (ID, Name) VALUES (2, 'Jay');
INSERT INTO mentors (ID, Name) VALUES (3, 'David');
INSERT INTO mentors (ID, Name) VALUES (4, 'Aaron');
INSERT INTO mentors (ID, Name) VALUES (5, 'Shruti');

INSERT INTO shifts (ID, Time, StudentID, FreeStudents) 
VALUES (1, "11:30-12:30", 1, 'Jay, David, Aaron');

INSERT INTO shifts (ID, Time, StudentID, FreeStudents) 
VALUES (2, "12:30-13:30", 2, 'Steven, David, Aaron');

INSERT INTO shifts (ID, Time, StudentID, FreeStudents) 
VALUES (3, "13:30-14:30", 3, 'Steven, Jay, Aaron');

INSERT INTO shifts (ID, Time, StudentID, FreeStudents) 
VALUES (4, "14:30-15:30", 4, 'Shruti, David, Jay');

INSERT INTO shifts (ID, Time, StudentID, FreeStudents) 
VALUES (5, "15:30-16:30", 5, 'David, Aaron');

SELECT freestudents FROM shifts WHERE
  studentid = 
  (SELECT id FROM mentors WHERE name = "Aaron");