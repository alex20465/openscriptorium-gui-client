import {Pipe, PipeTransform} from '@angular/core';
import {Alert, AlertLevel} from './manager.service';

@Pipe({
    name: 'alertClass'
})
export class AlertClassPipe implements PipeTransform {

    transform(value: Alert, args?: any): any {
        let className: string;
        switch (value.level) {
            case (AlertLevel.DANGER):
                className = 'danger';
                break;
            case (AlertLevel.WARNING):
                className = 'warning';
                break;
            case (AlertLevel.SUCCESS):
                className = 'success';
                break;
            case (AlertLevel.INFO):
                className = 'info';
                break;
        }

        return 'alert-' + className;
    }

}
