import {Routes, RouterModule} from '@angular/router';
import {SearchComponent} from './search/search.component';
import {NgModule} from '@angular/core';

const routes: Routes = [
    {
        path: 'search',
        component: SearchComponent
    },
    {
        path: '**',
        redirectTo: '/search'
    }
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes)
    ]
})
export class AppRouteModule {
}
