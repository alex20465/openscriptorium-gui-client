import { OpenscriptoriumGuiClientPage } from './app.po';

describe('openscriptorium-gui-client App', function() {
  let page: OpenscriptoriumGuiClientPage;

  beforeEach(() => {
    page = new OpenscriptoriumGuiClientPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
