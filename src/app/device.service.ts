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
    private modOs: any = null;
    private modGetos: any = null;
    private deviceCache: Device = null;

    constructor() {
        const req = (<any>window).require || null;

        if (req != null) {
            this.modGetos = req('getos');
            this.modOs = req('os');
        }
    }

    isSupported(): Boolean {
        let device: Device = null;
        try {
            device = this.getDevice();
        } catch (e) { }

        if (device === null) {
            return false;
        }

        return (new DeviceSupportEvaluator(device)).isSupported();
    }

    getDevice(): Device {
        if (this.modOs === null || this.modGetos === null) {
            throw new Error('Device is not recognizable.');
        } else if (this.deviceCache) {
            return this.deviceCache;
        } else {
            const device = new Device();
            device.platform = this.modOs.platform();
            device.architecture = this.modOs.arch();
            device.hostname = this.modOs.hostname();
            this.modGetos((e, os) => {
                if (e !== null) {
                    throw e;
                }
                device.distribution = `${os.dist}:${os.codename}:${os.release}`;
            });
            return this.deviceCache = device;
        }
    }
}
