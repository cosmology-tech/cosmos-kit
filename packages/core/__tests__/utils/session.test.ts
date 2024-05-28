import { Session } from '../../src/utils';

jest.useFakeTimers(); // 使用 Jest 提供的虚拟定时器
jest.spyOn(global, 'setTimeout');
jest.spyOn(global, 'clearTimeout');


describe('Session', () => {

  beforeEach(() => {
    jest.clearAllMocks()
    jest.clearAllTimers()
  })

  it('should call callback after specified duration', () => {
    const callback = jest.fn();
    const sessionOptions = { duration: 1000, callback };

    const session = new Session(sessionOptions);

    session.update();

    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(expect.any(Function), 1000);

    jest.advanceTimersByTime(1000);

    expect(callback).toHaveBeenCalledTimes(1);
  });

  it('should clear previous timeout before setting new one', () => {
    const callback = jest.fn();
    const sessionOptions = { duration: 1000, callback };

    const session = new Session(sessionOptions);

    session.update();

    session.update();

    expect(clearTimeout).toHaveBeenCalledTimes(1);

    expect(setTimeout).toHaveBeenCalledTimes(2);
  });
});
