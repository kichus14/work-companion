import {Injectable} from '@angular/core';
import {LocalStorageService} from 'ngx-store';
import {Observable} from 'rxjs';
import {map, shareReplay} from 'rxjs/operators';
import {FREQUENTLY_USED_BRANCH} from '../constants/localstorage.constant';
import {ApiService} from './api.service';

export interface Project {
  description: string;
  id: number;
  key: string;
  link: string;
  name: string;
  public: boolean;
  type: string;
}

export interface Repos {
  id: number;
  link: string;
  name: string;
  public: boolean;
  slug: string;
  state: string;
  statusMessage: string;
  key: string;
}

export interface Branch {
  displayId: string;
  id: string;
  isDefault: boolean;
  type: string;
  project?: Project;
  repos?: Repos;
  key: string;
}

export enum FileType {
  file = 'FILE',
  directory = 'DIRECTORY',
}

export interface FrequentlyUsedBranch {
  times: number;
  branch: Branch;
}

export interface BranchFile {
  extension?: string;
  name: string;
  parent: string;
  fileName: string;
  path: string;
  type: FileType;
  repoLink: string;
  branch: string;
  children?: BranchFile[];
}

function convertLinksArrayToString<T>(response: any): T[] {
  return response.values.map((item: any) => {
    item.link = '';
    if (item.links != null && item.links.self != null && item.links.self.length > 0) {
      item.link = item.links.self[0].href;
      delete item.links;
    }
    return item as T;
  });
}

@Injectable({
  providedIn: 'root'
})
export class BitbucketFoldersService {

  constructor(
    private readonly apiService: ApiService,
    private readonly localStorage: LocalStorageService,
  ) {
  }

  public getProjects(): Observable<Project[]> {
    return this.apiService.get('projects?start=0&limit=1000').pipe(
      map((response: any) => {
        return convertLinksArrayToString<Project>(response);
      }),
      shareReplay({bufferSize: 1, refCount: true}),
    );
  }

  public getRepos(projectKey: string): Observable<Repos[]> {
    return this.apiService.get(`projects/${projectKey}/repos?avatarSize=48&start=0&limit=1000`).pipe(
      map((response: any) => {
        return convertLinksArrayToString<Repos>(response).map((repo) => {
          const key = (projectKey + '-' + repo.slug).toLowerCase();
          return {...repo, key};
        });
      }),
      shareReplay({bufferSize: 1, refCount: true}),
    );
  }

  public getBranches(projectKey: string, reposKey: string): Observable<Branch[]> {
    return this.apiService.get(`projects/${projectKey}/repos/${reposKey}/branches?avatarSize=48&start=0&limit=1000`)
      .pipe(
        map((response: any) => {
        return convertLinksArrayToString<Branch>(response).map((branch) => {
          const key = (projectKey + '-' + reposKey + '-' + branch.id.replace(/\//g, '-')).toLowerCase();
          return {...branch, key};
        });
      }),
      shareReplay({bufferSize: 1, refCount: true}),
    );
  }

  public getFilesList(projectKey: string, reposKey: string, branch: string): Observable<BranchFile[]> {
    const repoLink = `projects/${projectKey}/repos/${reposKey}`;
    return this.apiService.get(`${repoLink}/files?at=${branch}&limit=100000`)
      .pipe(map((response: any) => {
        const results: BranchFile[] = [];
        const level: any = {results};
        const paths = response.values;
        paths.forEach((path: string) => {
          path.split('/').reduce((currentLevel: any, name: string, i: number, a: string[]) => {
            if (!currentLevel[name]) {
              const fileExtensionRegex = new RegExp(/(?:\.([^.]+))?$/);
              const filePath = fileExtensionRegex.exec(name);
              let fileName = name;
              let extension: string | undefined;
              if (filePath != null && filePath.length > 1) {
                if (filePath[0] !== fileName) {
                  fileName = name.replace(filePath[0], '');
                  extension = filePath[1];
                }
              }
              const ind = a.indexOf(name);
              const cloneA = [...a];
              const currentA = cloneA.splice(0, ind + 1);
              currentA.pop();
              currentLevel[name] = {results: []};
              const parent = currentA.join('/');
              currentLevel.results.push({
                fileName,
                extension,
                type: cloneA.length > 0 ? FileType.directory : FileType.file,
                children: currentLevel[name].results,
                name,
                parent,
                path: parent !== '' ? `${parent}/${name}` : name,
                repoLink,
                branch
              });
            }
            return currentLevel[name];
          }, level);
        });
        return level.results;
      }));
  }

  public getFilesAt(repoLink: string, branch: string, filePath: string): Observable<any> {
    return this.apiService.get(`${repoLink}/browse/${filePath}?at=${encodeURIComponent(branch)}&limit=20000`)
      .pipe(
        shareReplay(1),
        );
  }

  public getFrequentlyUsedBranch(): FrequentlyUsedBranch[] {
    const branches = this.localStorage.get(FREQUENTLY_USED_BRANCH);
    return branches == null ? [] : branches;
  }

  public setFrequentlyUsedBranch(selectedBranch: Branch): void {
    let storedBranches: FrequentlyUsedBranch[] = this.localStorage.get(FREQUENTLY_USED_BRANCH);
    if (storedBranches == null) {
      storedBranches = [];
    }
    const existingBranch = storedBranches.find((freqBranch) => {
      return freqBranch.branch.key === selectedBranch.key;
    });
    if (existingBranch != null) {
      existingBranch.times = existingBranch.times + 1;
      existingBranch.branch = selectedBranch;
    } else {
      storedBranches.push({
        times: 1,
        branch: selectedBranch,
      });
    }
    this.localStorage.set(FREQUENTLY_USED_BRANCH, storedBranches);
  }
}
