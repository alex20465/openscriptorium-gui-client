import {
    browser, element, by, Key, ElementFinder, ElementArrayFinder
} from 'protractor';
import * as webdriver from 'selenium-webdriver';


export class OpenscriptoriumGuiClientPage {
    navigateTo(path: string = '') {
        return browser.get('/' + path);
    }

    clickNavbarRoute(route: string = '') {
        return element(by.css(`a[ng-reflect-router-link="${route}"]`)).click();
    }

    search(term: string): webdriver.promise.Promise<Array<ElementFinder>> {
        return element(by.cssContainingText('a', 'Search')).click()
            .then(() => {
                return element(by.id('search-input')).sendKeys(term);
            })
            .then(() => {
                return element(by.id('search-input')).sendKeys(Key.ENTER);
            })
            .then(() => {
                // any because the promise will be solved
                const p = element.all(by.css('#search-result-list .list-group-item'));
                return <any>p;
            });
    }

}
