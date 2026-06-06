import { computePhase, phaseLabel, segmentLabel } from '../match';

// Standard 2-period, 40 min periods, 15 min break, no actuals
// P = 2400s, B = 900s
// Timeline: [0..2399] period 1, [2400..3299] break, [3300..] period 2

describe('computePhase', () => {
  describe('two-period match with no actuals', () => {
    it('returns period 1 at start', () => {
      expect(computePhase(0, 40, 2, 15, [])).toEqual({
        type: 'period',
        number: 1,
        withinSeconds: 0,
      });
    });

    it('returns period 1 mid-period', () => {
      expect(computePhase(1200, 40, 2, 15, [])).toEqual({
        type: 'period',
        number: 1,
        withinSeconds: 1200,
      });
    });

    it('returns period 1 at last second before boundary', () => {
      expect(computePhase(2399, 40, 2, 15, [])).toEqual({
        type: 'period',
        number: 1,
        withinSeconds: 2399,
      });
    });

    it('returns break at period 1 boundary', () => {
      expect(computePhase(2400, 40, 2, 15, [])).toEqual({
        type: 'break',
        after: 1,
        withinSeconds: 0,
      });
    });

    it('returns break mid-break', () => {
      expect(computePhase(2700, 40, 2, 15, [])).toEqual({
        type: 'break',
        after: 1,
        withinSeconds: 300,
      });
    });

    it('returns period 2 at start of second period', () => {
      expect(computePhase(3300, 40, 2, 15, [])).toEqual({
        type: 'period',
        number: 2,
        withinSeconds: 0,
      });
    });

    it('clamps to period 2 beyond full match duration', () => {
      expect(computePhase(9999, 40, 2, 15, [])).toEqual({
        type: 'period',
        number: 2,
        withinSeconds: 6699,
      });
    });
  });

  describe('segment actuals override planned durations', () => {
    it('uses actual period duration instead of planned', () => {
      // Period 1 extended to 50 min (3000s)
      expect(computePhase(2900, 40, 2, 15, [3000])).toEqual({
        type: 'period',
        number: 1,
        withinSeconds: 2900,
      });
    });

    it('uses actual break duration instead of planned', () => {
      // Period 1 = 2400s, break actual = 600s → break ends at 3000
      expect(computePhase(2700, 40, 2, 15, [2400, 600])).toEqual({
        type: 'break',
        after: 1,
        withinSeconds: 300,
      });
    });

    it('shifts period 2 start when break actual is shorter', () => {
      // Period 1 = 2400, break actual = 600 → period 2 starts at 3000
      expect(computePhase(3000, 40, 2, 15, [2400, 600])).toEqual({
        type: 'period',
        number: 2,
        withinSeconds: 0,
      });
    });
  });

  describe('four-period match', () => {
    it('returns period 3 correctly', () => {
      // P=1200, B=300 (20min periods, 5min breaks)
      // seg0=1200, seg1=300, seg2=1200, seg3=300, seg4=1200
      // period 3 starts at 1200+300+1200+300 = 3000
      expect(computePhase(3000, 20, 4, 5, [])).toEqual({
        type: 'period',
        number: 3,
        withinSeconds: 0,
      });
    });
  });
});

describe('phaseLabel', () => {
  it('labels period 1 as "1st Period"', () => {
    expect(phaseLabel({ type: 'period', number: 1, withinSeconds: 0 }, 2)).toBe('1st Period');
  });

  it('labels period 2 as "2nd Period"', () => {
    expect(phaseLabel({ type: 'period', number: 2, withinSeconds: 0 }, 2)).toBe('2nd Period');
  });

  it('labels period 3 as "3rd Period"', () => {
    expect(phaseLabel({ type: 'period', number: 3, withinSeconds: 0 }, 4)).toBe('3rd Period');
  });

  it('labels period 4 as "4th Period"', () => {
    expect(phaseLabel({ type: 'period', number: 4, withinSeconds: 0 }, 4)).toBe('4th Period');
  });

  it('labels the break as "Half Time" in a 2-period match', () => {
    expect(phaseLabel({ type: 'break', after: 1, withinSeconds: 0 }, 2)).toBe('Half Time');
  });

  it('labels breaks as "Break" in a 4-period match', () => {
    expect(phaseLabel({ type: 'break', after: 1, withinSeconds: 0 }, 4)).toBe('Break');
    expect(phaseLabel({ type: 'break', after: 2, withinSeconds: 0 }, 4)).toBe('Break');
    expect(phaseLabel({ type: 'break', after: 3, withinSeconds: 0 }, 4)).toBe('Break');
  });
});

describe('segmentLabel', () => {
  it('labels index 0 as "1st Period"', () => {
    expect(segmentLabel(0, 2)).toBe('1st Period');
  });

  it('labels index 1 as "Half Time" in a 2-period match', () => {
    expect(segmentLabel(1, 2)).toBe('Half Time');
  });

  it('labels index 2 as "2nd Period"', () => {
    expect(segmentLabel(2, 2)).toBe('2nd Period');
  });

  it('labels index 1 as "Break" in a 4-period match', () => {
    expect(segmentLabel(1, 4)).toBe('Break');
  });

  it('labels index 3 as "Break" in a 4-period match', () => {
    expect(segmentLabel(3, 4)).toBe('Break');
  });

  it('labels index 4 as "3rd Period"', () => {
    expect(segmentLabel(4, 4)).toBe('3rd Period');
  });
});
