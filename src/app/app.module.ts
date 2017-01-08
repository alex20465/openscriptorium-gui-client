import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AppRouteModule} from './app.routing.module';
import {RouterModule} from '@angular/router';
import {OpenscriptoriumService} from './openscriptorium.service';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SearchModule} from './search/search.module';

@NgModule({
    declarations: [
        AppComponent,
    ],

    imports: [
        NgbModule.forRoot(),
        RouterModule,
        SearchModule,
        AppRouteModule,
        BrowserModule,
        FormsModule,
        HttpModule
    ],
    providers: [
        OpenscriptoriumService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
