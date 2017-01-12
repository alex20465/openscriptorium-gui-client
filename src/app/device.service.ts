import {Injectable} from '@angular/core';

export class DeviceSupportEvaluator {

    constructor(private device: Device) {
    }

    isSupported() {
        if (this.device.platform === 'linux') {
            return true;
        }

        return false;
    }
}

export class Device {
    public platform: string;
    public architecture: string;
    public hostname: string;
    public distribution: string;
}

@Injectable()
export class DeviceService {
    private m_os: any;
    private m_getos: any;
    private deviceCache: Device = null;

    constructor() {
        this.m_os = (<any>window).require('os');
        this.m_getos = (<any>window).require('getos');
    }

    getDevice(): Device {
        if (this.deviceCache) {
            return this.deviceCache;
        } else {
            const device = new Device();
            device.platform = this.m_os.platform();
            device.architecture = this.m_os.arch();
            device.hostname = this.m_os.hostname();
            this.m_getos((e, os) => {
                if (e !== null) {
                    throw e;
                }
                device.distribution = `${os.dist}:${os.codename}:${os.release}`;
            });
            return this.deviceCache = device;
        }
    }
}
