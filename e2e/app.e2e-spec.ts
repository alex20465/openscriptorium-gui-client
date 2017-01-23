import {OpenscriptoriumGuiClientPage} from './app.po';
import {element, by} from 'protractor';

describe('openscriptorium-gui-client App', function () {
    let page: OpenscriptoriumGuiClientPage;

    beforeEach(() => {
        page = new OpenscriptoriumGuiClientPage();
        page.navigateTo();
    });

    it('should display search results with term: test', () => {
        page.search('test').then(elements => {
            expect(elements.length).toBe(1);
            expect(elements[0].getText()).toContain('test');
        });
    });

    it('should not display search results with term: uniqueue12', () => {
        page.search('uniqueue12').then(elements => {
            expect(elements.length).toBe(0);
        });
    });

    it('should display modal of the selected package/script result', () => {
        page.search('test').then(elements => {
            return elements[0].click();
        }).then(() => {
            return element(by.css('.modal'));
        }).then(ele => {
            expect(ele.isDisplayed()).toBe(true);
            expect(ele.getText()).toContain('Openscriptorium Test');
            expect(ele.getText()).toContain('Execute');
            expect(ele.getText()).toContain('Close');
        });
    });

    it('should add package process to runner for execution', () => {
        page.search('test').then(elements => {
            return elements[0].click();
        }).then(() => {
            return element(by.buttonText('Execute')).click();
        }).then(() => {
            expect(element(by.css('a[ng-reflect-router-link="/runner"] span')).getText()).toEqual('1');
            return element(by.css('a[ng-reflect-router-link="/runner"]')).click();
        });
    });

    it('should select by default queued process', () => {
        page.search('test').then(elements => {
            return elements[0].click();
        }).then(() => {
            return element(by.buttonText('Execute')).click();
        }).then(() => {
            return page.clickNavbarRoute('/runner');
        }).then(() => {
            expect(element(by.css('#process-list .list-group-item.active')).getText())
                .toContain('test');
        });
    });

});
