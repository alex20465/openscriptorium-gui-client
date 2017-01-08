import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs';
import 'rxjs/add/operator/map';

export class Script {
    id: Number;
    content: string;
    version: string;
    platforms: Array<string>;
    architectures: Array<string>;
}

export class Package {
    name: string;
    scripts: Array<Script>
}

export class PackageResult {
    packages: Array<Package>;
    count: Number;
    next: string;
    previous: string;
    currentPage: Number;
}

interface Hydrator<T> {
    extract(instance: T): Object;
    hydrate(data: Object, instance: T): T;
}

class PackageHydrator implements Hydrator<Package> {

    extract(instance: Package): Object {
        throw new Error('not implemented');
    }

    hydrate(data: Object, instance: Package): Package {
        instance.name = data['name'] || null;
        instance.scripts = data['scripts'].map((data) => {
            let script = new Script();
            let hydrator = new ScriptHydrator();
            hydrator.hydrate(data, script);
            return script;
        });

        return instance;
    }
}

class ScriptHydrator implements Hydrator<Script> {

    extract(instance: Script): Object {
        throw new Error('not implemented');
    }

    hydrate(data: Object, instance: Script): Script {
        instance.content = data['content'] || null;
        instance.id = data['id'] || null;
        instance.version = data['version'] || null;
        instance.platforms = data['platforms'] || null;
        instance.architectures = data['architectures'] || null;

        return instance;
    }
}

class PackageResultHydrator implements Hydrator<PackageResult> {

    extract(instance: PackageResult): Object {
        throw new Error('not implemented');
    }

    hydrate(data: Object, instance: PackageResult): PackageResult {
        instance.count = data['count'] || null;
        instance.currentPage = data['current_page'] || null;
        instance.next = data['next'] || null;
        instance.previous = data['previous'] || null;
        instance.packages = data['results'].map((data) => {
            let pkg = new Package();
            let hydrator = new PackageHydrator();
            hydrator.hydrate(data, pkg);
            return pkg;
        });
        return instance;
    }
}

@Injectable()
export class OpenscriptoriumService {

    private url: string;

    constructor(private http: Http) {
        this.url = environment.apiUrl;
    }

    search(term): Observable<PackageResult> {
        return <any>this.http.get(`${this.url}/packages/?term=${term}`)
            .map(this.parse)
            .catch(this.errorHandler);

    }

    private parse(res: Response): PackageResult {
        let data = res.json();
        let results = new PackageResult();
        let hydrator = new PackageResultHydrator();
        hydrator.hydrate(data, results);

        return results;
    }

    private errorHandler(err: Error) {
        console.log('error has been occurred');
        return Observable.throw(err.message);
    }
}