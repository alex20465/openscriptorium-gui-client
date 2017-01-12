import {Routes, RouterModule} from '@angular/router';
import {SearchComponent} from './search/search.component';
import {NgModule} from '@angular/core';
import {RunnerComponent} from './runner/runner.component';

const routes: Routes = [
    {
        path: 'search',
        component: SearchComponent
    },
    {
        path: 'runner',
        component: RunnerComponent
    },
    {
        path: '**',
        redirectTo: '/search'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {
            useHash: true
        })
    ]
})
export class AppRouteModule {
}
