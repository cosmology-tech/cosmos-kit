import { WalletBase } from '../../src/bases'
import { mockExtensionInfo as walletInfo } from '../../test-utils/mock-extension/extension/registry';
import { Callbacks, DisconnectOptions, State, WalletClient } from '../../src/types'; // Replace 'path/to/callbacks' with the actual path to the Callbacks type
import { EventEmitter } from 'stream';
import { ClientNotExistError, ConnectError, RejectedError } from '../../src/utils';

class WalletBaseImplement extends WalletBase {
  chainName: string;
  initClient(options?: any): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
  update(): void | Promise<void> {
    throw new Error('Method not implemented.');
  }
}

function storageMock() {
  let storage = {};

  return {
    setItem: function (key, value) {
      storage[key] = value || '';
    },
    getItem: function (key) {
      return key in storage ? storage[key] : null;
    },
    removeItem: function (key) {
      delete storage[key];
    },
    get length() {
      return Object.keys(storage).length;
    },
    key: function (i) {
      const keys = Object.keys(storage);
      return keys[i] || null;
    }
  };
}

const storageMockInstance = storageMock()

// Mock global window object
global.window = {
  // @ts-ignore
  localStorage: storageMockInstance
}

describe('WalletBase', () => {
  let wallet: WalletBaseImplement;

  beforeEach(() => {
    wallet = new WalletBaseImplement(walletInfo);
    wallet.chainName = 'cosmoshub-4'
  });

  afterEach(() => {
    // Clean up
  });

  it('should initialize with the correct wallet info', () => {
    expect(wallet.walletInfo.name).toBe('mock-extension');
    expect(wallet.walletInfo.prettyName).toBe('Mock');
  });

  it('should get appUrl', () => {
    const client: WalletClient = {
      getSimpleAccount: jest.fn(),
      appUrl: {
        state: State.Done,
        data: {
          native: 'http://native.com'
        }
      }
    };
    jest.spyOn(wallet, 'client', 'get').mockReturnValue(client);
    expect(wallet.appUrl).toMatchObject({ state: 'Done', data: { native: 'http://native.com' } })
  })

  it('should get qrUrl', () => {
    const client: WalletClient = {
      getSimpleAccount: jest.fn(),
      qrUrl: {
        state: State.Done,
        data: 'http://qrl.com'
      }
    };
    jest.spyOn(wallet, 'client', 'get').mockReturnValue(client);
    expect(wallet.qrUrl).toMatchObject({ state: 'Done', data: 'http://qrl.com' })
  })

  it('should activate the wallet', () => {
    wallet.activate();
    expect(wallet.isActive).toBe(true);
  });

  it('should inactivate the wallet', () => {
    wallet.inactivate();
    expect(wallet.isActive).toBe(false);
  });

  it('should set walletInfo when constructor', () => {
    expect(wallet.walletInfo).toBe(walletInfo);
  })

  it('should get client data', () => {
    const client: WalletClient = { getSimpleAccount: jest.fn() };
    jest.spyOn(wallet, 'client', 'get').mockReturnValue(client);
    expect(wallet.client).toBe(client)
  })

  it('should initialize the client', () => {
    wallet.initingClient();
    expect(wallet.clientMutable.state).toBe(State.Pending);
    expect(wallet.clientMutable.message).toBeUndefined();
    expect(wallet.clientMutable.data).toBeUndefined();
  });

  it('should set the client after initialization', () => {
    const client: WalletClient = { getSimpleAccount: jest.fn() };
    wallet.initClientDone(client);
    expect(wallet.clientMutable.data).toBe(client);
    expect(wallet.clientMutable.state).toBe(State.Done);
    expect(wallet.clientMutable.message).toBeUndefined();
  });

  it('should set the error message after client initialization error', () => {
    const error = new Error('Client initialization error');
    wallet.initClientError(error);
    expect(wallet.clientMutable.message).toBe('Client initialization error');
    expect(wallet.clientMutable.state).toBe(State.Error);
  });

  it('should get the wallet name', () => {
    expect(wallet.walletName).toBe('mock-extension');
  });

  it('should get the wallet pretty name', () => {
    expect(wallet.walletPrettyName).toBe('Mock');
  });

  it('should return true for isModeExtension when wallet mode is extension', () => {
    expect(wallet.isModeExtension).toBe(true);
  });

  it('should return false for isModeWalletConnect when wallet mode is not WalletConnect', () => {
    expect(wallet.isModeWalletConnect).toBe(false);
  });

  it('should get right download info', async () => {
    jest.spyOn(wallet, 'env', 'get').mockReturnValue({ device: 'desktop', browser: 'chrome', os: 'ios' });
    expect(wallet.downloadInfo).toMatchObject({
      device: 'desktop',
      browser: 'chrome',
      link: 'https://chrome.google.com/webstore/detail/mock-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    });

    jest.spyOn(wallet, 'env', 'get').mockReturnValue({});
    expect(wallet.downloadInfo).toMatchObject({
      link: 'https://chrome.google.com/webstore/detail/mock-cosmos-wallet/fcfcfllfndlomdhbehjjcoimbgofdncg',
    },);
  });

  it('should get the reject message source', () => {
    expect(wallet.rejectMessageSource).toBe('Request rejected');

    jest.spyOn(wallet, 'walletInfo', 'get').mockReturnValue({
      rejectMessage: 'reject Message define as string'
    } as any);
    expect(wallet.rejectMessageSource).toBe('reject Message define as string');
  });


  it('should get the reject message target', () => {
    jest.spyOn(wallet, 'walletInfo', 'get').mockReturnValue({
      rejectMessage: {
        target: 'Target reject Message define as target'
      }
    } as any);
    expect(wallet.rejectMessageTarget).toBe('Target reject Message define as target');

    jest.spyOn(wallet, 'walletInfo', 'get').mockReturnValue({
      rejectMessage: 'Target reject Message define as string'
    } as any);
    expect(wallet.rejectMessageTarget).toBe(undefined);
  });

  it('should get the reject code', () => {
    expect(wallet.rejectCode).toBe(404);
  });

  it('should register and call update callbacks', () => {
    const callback1: Callbacks = {
      beforeConnect: jest.fn(),
    }

    const callback2 = {
      beforeConnect: jest.fn(),
      beforeDisconnect: jest.fn(),
      afterConnect: jest.fn(),
    }
    wallet.updateCallbacks(callback1);
    expect(wallet.callbacks).toMatchObject(callback1)
    wallet.updateCallbacks(callback2);
    expect(wallet.callbacks).toMatchObject(callback2)
  });

  it('should call disconnect method with sync and options parameters', async () => {
    const sync = true;
    const options: DisconnectOptions = {
      walletconnect: {
        removeAllPairings: true
      }
    };
    const callbacks: Callbacks = {
      beforeDisconnect: jest.fn(),
      afterDisconnect: jest.fn()
    }
    const walletClient = {
      getSimpleAccount: jest.fn(),
      disconnect: jest.fn()
    }

    wallet.emitter = new EventEmitter();
    const emitMock = jest.spyOn(wallet.emitter, 'emit').mockImplementation((event, chainName) => true)
    const resetMock = jest.spyOn(wallet, 'reset').mockImplementation(() => true)

    const localStorageRemoveItemMock = jest.spyOn(window.localStorage, 'removeItem');

    wallet.updateCallbacks(callbacks)
    wallet.initClientDone(walletClient)

    await wallet.disconnect(sync, options);

    expect(callbacks.beforeDisconnect).toHaveBeenCalled()
    expect(callbacks.afterDisconnect).toHaveBeenCalled()
    expect(walletClient.disconnect).toHaveBeenCalledWith(options)
    expect(emitMock).toHaveBeenCalledWith('sync_disconnect', 'cosmoshub-4')
    expect(resetMock).toHaveBeenCalled()
    expect(localStorageRemoveItemMock).toBeCalledWith("cosmos-kit@2:core//current-wallet")
  });


  it('should set the client as not exist', () => {
    wallet.setClientNotExist();
    expect(wallet.mutable).toMatchObject({ message: ClientNotExistError.message, state: State.Error })

    const error = new Error('what ever error message');
    wallet.setClientNotExist(error);
    expect(wallet.mutable).toMatchObject({ message: ClientNotExistError.message, state: State.Error })
  });

  it('should set the wallet as rejected', () => {
    wallet.setRejected();
    expect(wallet.mutable).toMatchObject({ message: RejectedError.message, state: State.Error });

    const error = new Error('what ever error message');
    wallet.setRejected(error);
    expect(wallet.mutable).toMatchObject({ message: RejectedError.message, state: State.Error });
  });

  it('should set the error message', () => {
    const errorMessage = 'Test error message';
    wallet.setError(errorMessage);
    expect(wallet.mutable).toMatchObject({ message: errorMessage, state: State.Error });

    wallet.throwErrors = true;
    expect(() => wallet.setError(errorMessage)).toThrowError(errorMessage)

    wallet.throwErrors = 'connect_only'
    expect(() => wallet.setError(new ConnectError('connect error'))).toThrowError('connect error')
  });

  it('should connect to the wallet', async () => {
    const sync = true;
    const callbacks: Callbacks = {
      beforeConnect: jest.fn(),
      afterConnect: jest.fn()
    }
    const walletClient = {
      getSimpleAccount: jest.fn(),
      connect: jest.fn()
    }
    wallet.emitter = new EventEmitter();
    const emitMock = jest.spyOn(wallet.emitter, 'emit').mockImplementation((event, chainName) => true)
    const updateMock = jest.spyOn(wallet, 'update').mockImplementation(() => { })

    wallet.updateCallbacks(callbacks)
    wallet.initClientDone(walletClient)
    await wallet.connect(sync);
    expect(callbacks.beforeConnect).toHaveBeenCalled()
    expect(callbacks.afterConnect).toHaveBeenCalled()
    expect(emitMock).toHaveBeenCalledWith('sync_connect', 'cosmoshub-4')
    expect(updateMock).toHaveBeenCalled()

    jest.spyOn(wallet, 'isMobile', 'get').mockReturnValue(true);
    jest.spyOn(wallet, 'walletInfo', 'get').mockReturnValue({ mobileDisabled: true } as any);
    const setErrorMock = jest.spyOn(wallet, 'setError').mockImplementation(() => { })
    await wallet.connect(sync);
    expect(setErrorMock).toBeCalledWith(new ConnectError('This wallet is not supported on mobile, please use desktop browsers.'))
  });

});
