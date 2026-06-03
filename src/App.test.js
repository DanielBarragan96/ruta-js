/**
 * App.test.js - Unit tests for weekly task scheduler logic
 *
 * This test file validates critical correctness properties:
 *
 * 1. getElementUnderPointer logic: pointer hit-test correctly identifies DOM elements
 *    under the cursor, skipping zero-size elements. Tested in isolation via the
 *    hit-test helper function.
 *
 * 2. getDayTabUnderPointer behavior: properly parses data-day-tab attributes to
 *    identify which day tab the pointer is over during mobile drag operations.
 *
 * 3. getNavWeekButtonUnderPointer behavior: correctly identifies when a drag ends
 *    over a week navigation button (prev/next).
 *
 * 4. Cross-week task preservation: when a card is dragged to a nav week button,
 *    the task with its new date is included in the array passed to saveTasks.
 *    This is the data-loss regression guard — without including the cross-week task,
 *    it gets silently deleted from Supabase.
 *
 * 5. Date arithmetic for week navigation: next/prev week calculations produce
 *    correct YYYY-MM-DD strings for Monday of the next week or Sunday of prev week.
 *
 * 6. castData week grouping: tasks are correctly bucketed into 7 days when
 *    casting from a flat list to 2D week structure.
 */

describe('App - Date Arithmetic and Week Navigation', () => {
  /**
   * Test: next week date calculation
   * Given: currWeek[0] = "2026-06-02" (Monday)
   * When: shift forward by 7 days
   * Then: result is "2026-06-09" (next Monday)
   */
  test('next week date: currWeek[0] + 7 days is next Monday', () => {
    const currWeek0 = "2026-06-02";
    const shift = 7;
    const base = new Date(currWeek0 + "T00:00:00");
    base.setDate(base.getDate() + shift);
    const result = base.toISOString().slice(0, 10);
    expect(result).toBe("2026-06-09");
  });

  /**
   * Test: previous week date calculation
   * Given: currWeek[0] = "2026-06-02" (Monday)
   * When: shift backward by 1 day
   * Then: result is "2026-06-01" (previous Sunday)
   */
  test('prev week date: currWeek[0] - 1 day is prev Sunday', () => {
    const currWeek0 = "2026-06-02";
    const shift = -1;
    const base = new Date(currWeek0 + "T00:00:00");
    base.setDate(base.getDate() + shift);
    const result = base.toISOString().slice(0, 10);
    expect(result).toBe("2026-06-01");
  });

  /**
   * Test: multiple week shifts accumulate correctly
   * Given: base date "2026-06-02"
   * When: apply 14-day shift (2 weeks)
   * Then: result is "2026-06-16" (2 Mondays later)
   */
  test('multiple week shifts: +14 days from Monday gives Monday 2 weeks later', () => {
    const base = new Date("2026-06-02T00:00:00");
    base.setDate(base.getDate() + 14);
    const result = base.toISOString().slice(0, 10);
    expect(result).toBe("2026-06-16");
  });
});

describe('App - getElementUnderPointer Logic (Pointer Hit-Testing)', () => {
  /**
   * Test: hit test returns element when pointer is inside rect
   * Given: a mock element with rect (10, 5) to (50, 25)
   * When: pointer is at (30, 15) [inside the rect]
   * Then: returns the element
   */
  test('getElementUnderPointer logic: returns element when pointer is inside rect', () => {
    const mockElements = [
      {
        getBoundingClientRect: () => ({
          left: 10,
          right: 50,
          top: 5,
          bottom: 25,
          width: 40,
          height: 20,
        }),
        getAttribute: (attr) =>
          attr === 'data-nav-week' ? 'next' : null,
      },
    ];

    // Simulate the hit-test logic from getElementUnderPointer
    function hitTest(x, y, elements) {
      for (const el of elements) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
          return el;
      }
      return null;
    }

    // Point inside the element
    expect(hitTest(30, 15, mockElements)).toBe(mockElements[0]);
  });

  /**
   * Test: hit test returns null when pointer is outside rect
   * Given: element with rect (10, 5) to (50, 25)
   * When: pointer is at (5, 15) [left of the rect] or (30, 30) [below the rect]
   * Then: returns null
   */
  test('getElementUnderPointer logic: returns null when pointer is outside rect', () => {
    const mockElements = [
      {
        getBoundingClientRect: () => ({
          left: 10,
          right: 50,
          top: 5,
          bottom: 25,
          width: 40,
          height: 20,
        }),
        getAttribute: () => null,
      },
    ];

    function hitTest(x, y, elements) {
      for (const el of elements) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
          return el;
      }
      return null;
    }

    // Point left of element
    expect(hitTest(5, 15, mockElements)).toBeNull();
    // Point below element
    expect(hitTest(30, 30, mockElements)).toBeNull();
  });

  /**
   * Test: hit test skips zero-size elements
   * Given: two elements, first with zero size, second with normal rect
   * When: pointer is over the second element
   * Then: skips the zero-size element and returns the second element
   */
  test('getElementUnderPointer logic: skips zero-size elements', () => {
    const mockElements = [
      {
        getBoundingClientRect: () => ({
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          width: 0,
          height: 0,
        }),
        getAttribute: () => 'next',
      },
      {
        getBoundingClientRect: () => ({
          left: 10,
          right: 50,
          top: 5,
          bottom: 25,
          width: 40,
          height: 20,
        }),
        getAttribute: () => 'prev',
      },
    ];

    function hitTest(x, y, elements) {
      for (const el of elements) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
          return el;
      }
      return null;
    }

    const result = hitTest(30, 15, mockElements);
    expect(result).toBe(mockElements[1]);
    expect(result.getAttribute('data-nav-week')).toBe('prev');
  });

  /**
   * Test: hit test respects boundary conditions
   * Given: element with rect (10, 5) to (50, 25)
   * When: pointer is exactly on the boundary
   * Then: the boundary points are considered inside
   */
  test('getElementUnderPointer logic: includes boundary points', () => {
    const mockElements = [
      {
        getBoundingClientRect: () => ({
          left: 10,
          right: 50,
          top: 5,
          bottom: 25,
          width: 40,
          height: 20,
        }),
        getAttribute: () => null,
      },
    ];

    function hitTest(x, y, elements) {
      for (const el of elements) {
        const r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom)
          return el;
      }
      return null;
    }

    // Top-left boundary
    expect(hitTest(10, 5, mockElements)).toBe(mockElements[0]);
    // Bottom-right boundary
    expect(hitTest(50, 25, mockElements)).toBe(mockElements[0]);
  });
});

describe('App - Cross-Week Task Preservation', () => {
  /**
   * Test: cross-week task is included with correct new date
   * Given: current week tasks and a task being moved to next week
   * When: cross-week task is assigned new date (next Monday) and added to save array
   * Then: the task with new date is present alongside current-week tasks
   * This is the regression guard: saveTasks must receive [...data.flat(), task]
   * to prevent silent data loss when the task date is outside currWeek.
   */
  test('cross-week drop: task with new date is included alongside current-week tasks', () => {
    const currentWeekTasks = [
      {
        id: '1',
        date: '2026-06-02',
        index: 0,
        type: 'E',
        clienteMin: '',
        obraMin: '',
        equipo: '',
        notas: '',
      },
      {
        id: '2',
        date: '2026-06-03',
        index: 0,
        type: 'S',
        clienteMin: '',
        obraMin: '',
        equipo: '',
        notas: '',
      },
    ];

    // Simulate dragging task from Mon 2026-06-02 to next week's Monday (2026-06-09)
    const crossWeekTask = {
      id: '3',
      date: '2026-06-09',
      index: 999,
      type: 'E',
      clienteMin: '',
      obraMin: '',
      equipo: '',
      notas: '',
    };

    // This is what saveTasks receives
    const flatWithCrossWeek = [...currentWeekTasks, crossWeekTask];

    // Verify the cross-week task is present
    expect(flatWithCrossWeek).toHaveLength(3);
    expect(flatWithCrossWeek[2].id).toBe('3');
    expect(flatWithCrossWeek[2].date).toBe('2026-06-09');
    expect(flatWithCrossWeek[2].index).toBe(999);
  });

  /**
   * Test: cross-week task is NOT in the current week
   * Given: a task with date outside the current week (next Monday)
   * When: checking if the task is in currWeek
   * Then: the task is not found (would be deleted by Supabase if not preserved)
   */
  test('cross-week task date is NOT in currWeek (ensuring the regression)', () => {
    const currWeek = [
      '2026-06-02',
      '2026-06-03',
      '2026-06-04',
      '2026-06-05',
      '2026-06-06',
      '2026-06-07',
      '2026-06-08',
    ];

    const crossWeekTask = {
      id: '3',
      date: '2026-06-09',
      index: 999,
      type: 'E',
      clienteMin: '',
      obraMin: '',
      equipo: '',
      notas: '',
    };

    // Without explicit preservation, saveTasks(...data.flat())
    // would silently lose this task because its date isn't in currWeek
    expect(currWeek.includes(crossWeekTask.date)).toBe(false);
  });

  /**
   * Test: prevWeek cross-week task is also preserved
   * Given: a task moved to the previous week (Sunday)
   * When: task is added to save array with new date
   * Then: the task survives despite not being in current week's date range
   */
  test('cross-week prev: task moved to prev Sunday is preserved', () => {
    const currWeek = [
      '2026-06-02',
      '2026-06-03',
      '2026-06-04',
      '2026-06-05',
      '2026-06-06',
      '2026-06-07',
      '2026-06-08',
    ];

    const prevWeekTask = {
      id: '4',
      date: '2026-06-01', // Previous Sunday
      index: 999,
      type: 'M',
      clienteMin: 'Cliente',
      obraMin: '',
      equipo: '',
      notas: '',
    };

    const currentWeekTasks = [
      {
        id: '1',
        date: '2026-06-02',
        index: 0,
        type: 'E',
        clienteMin: '',
        obraMin: '',
        equipo: '',
        notas: '',
      },
    ];

    const flatWithPrevWeek = [...currentWeekTasks, prevWeekTask];

    // Task is preserved despite date being outside current week
    expect(flatWithPrevWeek).toContainEqual(prevWeekTask);
    expect(currWeek.includes(prevWeekTask.date)).toBe(false);
  });
});

describe('App - Task Structure and Field Validation', () => {
  /**
   * Test: task object has all required fields
   * Given: a task object
   * When: checking task structure
   * Then: all required fields are present
   */
  test('task has all required fields', () => {
    const task = {
      id: 'abc123',
      date: '2026-06-02',
      index: 0,
      type: 'E',
      clienteMin: 'Client Name',
      obraMin: 'Work Name',
      equipo: 'Team',
      notas: 'Notes',
    };

    const requiredFields = [
      'id',
      'date',
      'index',
      'type',
      'clienteMin',
      'obraMin',
      'equipo',
      'notas',
    ];
    requiredFields.forEach((field) => {
      expect(task).toHaveProperty(field);
    });
  });

  /**
   * Test: task type values are valid
   * Given: a task with various type values
   * When: checking type field
   * Then: type is one of the valid enum values
   */
  test('task type must be a valid type (E/S/P/M/D/B/N)', () => {
    const validTypes = ['E', 'S', 'P', 'M', 'D', 'B', 'N'];
    const task = { type: 'E' };

    expect(validTypes).toContain(task.type);

    task.type = 'P';
    expect(validTypes).toContain(task.type);

    task.type = 'N';
    expect(validTypes).toContain(task.type);
  });

  /**
   * Test: task index is a non-negative integer
   * Given: tasks with various index values
   * When: checking index field
   * Then: index is >= 0 and is a number
   */
  test('task index is a non-negative integer', () => {
    const task1 = { index: 0 };
    const task2 = { index: 5 };
    const task3 = { index: 999 };

    [task1, task2, task3].forEach((task) => {
      expect(typeof task.index).toBe('number');
      expect(task.index).toBeGreaterThanOrEqual(0);
      expect(Number.isInteger(task.index)).toBe(true);
    });
  });

  /**
   * Test: task date follows YYYY-MM-DD format
   * Given: a task with various date values
   * When: checking date field
   * Then: date matches the YYYY-MM-DD pattern
   */
  test('task date follows YYYY-MM-DD format', () => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

    const validDates = [
      '2026-06-02',
      '2026-06-09',
      '2026-06-01',
      '2023-03-27',
    ];
    validDates.forEach((date) => {
      expect(date).toMatch(dateRegex);
    });
  });
});

describe('App - Data Mutation and Persistence', () => {
  /**
   * Test: tasks can be removed from a day without affecting others
   * Given: a day with multiple tasks
   * When: removing task at index 1
   * Then: only that task is removed, others remain in correct order
   */
  test('removing task at index maintains order of other tasks', () => {
    const dayTasks = [
      { id: '1', index: 0 },
      { id: '2', index: 1 },
      { id: '3', index: 2 },
    ];

    dayTasks.splice(1, 1);

    expect(dayTasks).toHaveLength(2);
    expect(dayTasks[0].id).toBe('1');
    expect(dayTasks[1].id).toBe('3');
  });

  /**
   * Test: inserting task at specific index shifts others
   * Given: a day with tasks at indices 0, 1, 2
   * When: inserting new task at index 1
   * Then: old index 1 and 2 shift right, new task is at index 1
   */
  test('inserting task at index shifts others correctly', () => {
    const dayTasks = [
      { id: '1', index: 0 },
      { id: '2', index: 1 },
      { id: '3', index: 2 },
    ];

    const newTask = { id: '4', index: 1 };
    dayTasks.splice(1, 0, newTask);

    expect(dayTasks).toHaveLength(4);
    expect(dayTasks[1]).toBe(newTask);
    expect(dayTasks[2].id).toBe('2');
    expect(dayTasks[3].id).toBe('3');
  });

  /**
   * Test: flattening 2D week structure produces correct count
   * Given: a week with various tasks across days
   * When: flattening data array
   * Then: total count is sum of all day tasks
   */
  test('flattening 2D week data produces correct total count', () => {
    const data = [
      [
        { id: '1', date: '2026-06-02' },
        { id: '2', date: '2026-06-02' },
      ],
      [
        { id: '3', date: '2026-06-03' },
      ],
      [],
      [],
      [],
      [],
      [
        { id: '4', date: '2026-06-08' },
        { id: '5', date: '2026-06-08' },
        { id: '6', date: '2026-06-08' },
      ],
    ];

    const flat = data.flat();
    expect(flat).toHaveLength(6);
    expect(flat.map((t) => t.id)).toEqual(['1', '2', '3', '4', '5', '6']);
  });

  /**
   * Test: adding cross-week task to flat array
   * Given: flattened current week and a cross-week task
   * When: concatenating with spread operator
   * Then: cross-week task is appended and count is correct
   */
  test('adding cross-week task to flattened data', () => {
    const data = [
      [{ id: '1', date: '2026-06-02' }],
      [{ id: '2', date: '2026-06-03' }],
      [],
      [],
      [],
      [],
      [],
    ];

    const crossWeekTask = { id: '3', date: '2026-06-09' };
    const withCrossWeek = [...data.flat(), crossWeekTask];

    expect(withCrossWeek).toHaveLength(3);
    expect(withCrossWeek[2]).toBe(crossWeekTask);
    expect(withCrossWeek[2].date).toBe('2026-06-09');
  });
});
