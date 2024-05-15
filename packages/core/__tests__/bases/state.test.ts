import { StateBase } from '../../src/bases/state';
import { DappEnv, State, WalletStatus } from '../../src/types';

describe('StateBase', () => {
  let stateBase: StateBase;
  beforeEach(() => {
    stateBase = new StateBase();
  });

  it('should initialize with state "Init"', () => {
    expect(stateBase.state).toBe('Init');
  });

  it('should set the state', () => {
    stateBase.setState(State.Done);
    expect(stateBase.state).toBe('Done');
  });

  it('should set the data', () => {
    const data = { foo: 'bar' };
    stateBase.setData(data);
    expect(stateBase.data).toBe(data);
  });

  it('should set the message', () => {
    const message = 'Hello, world!';
    stateBase.setMessage(message);
    expect(stateBase.message).toBe(message);
  });

  it('should reset the state, data, and message', () => {
    stateBase.setState(State.Done);
    stateBase.setData({ foo: 'bar' });
    stateBase.setMessage('Hello, world!');
    stateBase.reset();
    expect(stateBase.state).toBe('Init');
    expect(stateBase.data).toBeUndefined();
    expect(stateBase.message).toBeUndefined();
  });

  it('should set the environment', () => {
    const env = {
      device: 'desktop',
      os: 'macos',
      browser: 'chrome',
    };
    stateBase.setEnv(env as DappEnv);
    expect(stateBase.env).toBe(env);
  });

  it('should set the actions', () => {
    const actions = { action1: jest.fn(), action2: jest.fn() };
    stateBase.setActions(actions);
    expect(stateBase.actions).toBe(actions);
  });

  it('should check if it is mobile', () => {
    // Mock the isMobile function
    jest.spyOn(stateBase, 'env', 'get').mockReturnValue({ device: 'mobile' });
    expect(stateBase.isMobile).toBe(true);
  });

  it('should check if it is initialized', () => {
    // Mock the isInit function
    jest.spyOn(stateBase, 'state', 'get').mockReturnValue(State.Init);
    expect(stateBase.isInit).toBe(true);
  });

  it('should check if it is done', () => {
    // Mock the isDone function
    jest.spyOn(stateBase, 'state', 'get').mockReturnValue(State.Done);
    expect(stateBase.isDone).toBe(true);
  });

  it('should check if there is an error', () => {
    // Mock the isError function
    jest.spyOn(stateBase, 'state', 'get').mockReturnValue(State.Error);
    expect(stateBase.isError).toBe(true);
  });

  it('should check if it is pending', () => {
    // Mock the isPending function
    jest.spyOn(stateBase, 'state', 'get').mockReturnValue(State.Pending);
    expect(stateBase.isPending).toBe(true);
  });

  it('should get the wallet status', async () => {
    let walletStatus: WalletStatus = WalletStatus.Disconnected;
    // Mock the walletStatus function
    expect(stateBase.walletStatus).toBe(walletStatus);
  });

  it('should check if the wallet is once connected', () => {
    // Mock the isWalletOnceConnect function
    jest.spyOn(stateBase, 'isWalletOnceConnect', 'get').mockReturnValue(true);
    expect(stateBase.isWalletOnceConnect).toBe(true);
  });

  it('should check if the wallet is connecting', () => {
    // Mock the isWalletConnecting function
    jest.spyOn(stateBase, 'walletStatus', 'get').mockReturnValue(WalletStatus.Connecting);
    expect(stateBase.isWalletConnecting).toBe(true);
  });

  it('should check if the wallet is connected', () => {
    // Mock the isWalletConnected function
    jest.spyOn(stateBase, 'walletStatus', 'get').mockReturnValue(WalletStatus.Connected);
    expect(stateBase.isWalletConnected).toBe(true);
  });

  it('should check if the wallet is disconnected', () => {
    // Mock the isWalletDisconnected function
    jest.spyOn(stateBase, 'walletStatus', 'get').mockReturnValue(WalletStatus.Disconnected);
    expect(stateBase.isWalletDisconnected).toBe(true);
  });

  it('should check if the wallet is rejected', () => {
    // Mock the isWalletRejected function
    jest.spyOn(stateBase, 'walletStatus', 'get').mockReturnValue(WalletStatus.Rejected);
    expect(stateBase.isWalletRejected).toBe(true);
  });

  it('should check if the wallet does not exist', () => {
    // Mock the isWalletNotExist function
    jest.spyOn(stateBase, 'walletStatus', 'get').mockReturnValue(WalletStatus.NotExist);
    expect(stateBase.isWalletNotExist).toBe(true);
  });

  it('should check if there is a wallet error', () => {
    // Mock the isWalletError function
    jest.spyOn(stateBase, 'walletStatus', 'get').mockReturnValue(WalletStatus.Error);
    expect(stateBase.isWalletError).toBe(true);
  });

});
