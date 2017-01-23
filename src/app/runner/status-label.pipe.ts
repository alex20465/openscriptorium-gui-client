import {Pipe, PipeTransform} from '@angular/core';
import {PROCESS_STATUS} from './manager.service';

@Pipe({
    name: 'statusLabel'
})
export class StatusLabelPipe implements PipeTransform {

    transform(status: PROCESS_STATUS, args?: any): any {
        let label = 'Unknown status';
        switch (status) {
            case PROCESS_STATUS.SUCCESS:
                label = 'Successful';
                break;
            case PROCESS_STATUS.RUNNING:
                label = 'Running';
                break;
            case PROCESS_STATUS.QUEUED:
                label = 'Queued';
                break;
            case PROCESS_STATUS.FETCHING:
                label = 'Fetching data';
                break;
            case PROCESS_STATUS.FAILED:
                label = 'Failed';
                break;
        }

        return label;
    }

}
