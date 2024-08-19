import {
  EMERYNET_FAUCET_URL,
  DEFAULT_TIMEOUT,
  AGORIC_ADDR_RE,
} from '../constants';

describe('Keplr example-lite  Dapp', () => {


  it(`should setup a Keplr wallet`, () => {
    console.log(cy.isCypressWindowActive())
    cy.setupWallet({
      // walletName: 'my created wallet',
      // selectedChains: ['Agoric'],
      secretWords: "project dirt push parrot spider exhaust child dance disease palm lounge six",
    }).then(setupFinished => {
      expect(setupFinished).to.be.true;
    });
  })

  it('Open modal And connection with wallet', () => {
    cy.log('Clicking the Connect Keplr Wallet button');
    cy.contains('Open Modal').click();
    cy.get('.modal').should('be.visible');
    cy.contains('Connect').click();
    cy.acceptAccess();
  });



  // cy.getWalletAddress('Agoric').then(address => {
  //   // provision IST
  //   cy.log('Agoric Address:', walletAddress);
  //   console.log('Agoric Address:', walletAddress);
  //   cy.provisionFromFaucet(address, 'client', 'REMOTE_WALLET');
  // });


  // it(`get the accurate values for the tokens in the wallet`, () => {
  //   cy.switchWallet('My Wallet').then(taskCompleted => {
  //     expect(taskCompleted).to.be.true;
  //   });

  //   cy.addNewTokensFound();

  //   cy.getTokenAmount('ATOM').then(tokenValue => {
  //     expect(tokenValue).to.equal(0);
  //   });

  //   cy.getTokenAmount('BLD').then(tokenValue => {
  //     expect(tokenValue).to.equal(331);
  //   });
  //   // TODO: Add some more robust check later
  // });




});
