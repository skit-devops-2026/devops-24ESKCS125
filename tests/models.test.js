const Task = require('../server/models/Task');
const Subject = require('../server/models/Subject');
const User = require('../server/models/User');
const Note = require('../server/models/Note');
const Exam = require('../server/models/Exam');
const CalendarEvent = require('../server/models/CalendarEvent');
const FocusSession = require('../server/models/FocusSession');

describe('Mongoose Models Schema Verification', () => {
  test('Task model has required fields', () => {
    const task = new Task({
      id: 12345,
      title: 'Math Homework',
      subject: 'Mathematics',
      date: '2026-10-30'
    });

    expect(task.id).toBe(12345);
    expect(task.title).toBe('Math Homework');
    expect(task.priority).toBe('Medium');
    expect(task.status).toBe('Pending');
  });

  test('Subject model structure', () => {
    const subject = new Subject({
      id: 1,
      name: 'Computer Networks',
      code: 'CS401'
    });

    expect(subject.name).toBe('Computer Networks');
    expect(subject.code).toBe('CS401');
    expect(Array.isArray(subject.topics)).toBe(true);
  });

  test('User model has email and name', () => {
    const user = new User({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123'
    });

    expect(user.name).toBe('John Doe');
    expect(user.email).toBe('john@example.com');
  });

  test('Note model structure', () => {
    const note = new Note({
      id: 999,
      title: 'Lecture 1 Notes',
      subject: 'OS',
      content: 'Process scheduling...'
    });

    expect(note.id).toBe(999);
    expect(note.type).toBe('text');
  });

  test('Exam model structure', () => {
    const exam = new Exam({
      id: 101,
      name: 'Mid Term',
      subject: 'DBMS',
      date: '2026-11-15'
    });

    expect(exam.name).toBe('Mid Term');
    expect(exam.subject).toBe('DBMS');
  });

  test('CalendarEvent model structure', () => {
    const event = new CalendarEvent({
      id: 202,
      title: 'Lab Submission',
      date: '2026-11-01'
    });

    expect(event.category).toBe('Task');
    expect(event.priority).toBe('Medium');
  });

  test('FocusSession model structure', () => {
    const session = new FocusSession({
      id: 303,
      date: '2026-10-27',
      duration: 25
    });

    expect(session.duration).toBe(25);
    expect(session.mode).toBe('focus');
  });
});
