import { formatTime } from '../formatTime';

describe('format time minutes correctly', () => {
  it('should convert 90 minutes in hours', () => {
    const time = formatTime(90);
    expect(time).toEqual('01:30 hora(s)');
  });

  it('should format 15 minutes', () => {
    const time = formatTime(15);
    expect(time).toEqual('15 min');
  });

  it('should throw if is a invalid number > 1440 or < 0', () => {
    expect(() => formatTime(1441)).toThrow();
    expect(() => formatTime(-1)).toThrow();
  });
});


