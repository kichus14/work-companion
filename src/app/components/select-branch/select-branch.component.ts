import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {Observable, of} from 'rxjs';
import {finalize, map} from 'rxjs/operators';
import {BitbucketFoldersService, Branch, FrequentlyUsedBranch, Project, Repos} from '../../services/bitbucket-folders.service';

enum TreeNodeTypes {
  Project = 'project',
  Repos = 'repos',
  Branch = 'branch',
}

function clearSelected(selectedKey: string, childrens: any): void {
  childrens.forEach((child: any) => {
    if (child.key === selectedKey) {
      return;
    }
    if (child.children != null) {
      clearSelected(selectedKey, child.children);
      return;
    }
    if (child.node != null && child.node.children != null) {
      clearSelected(selectedKey, child.node.children);
      return;
    }
    child.partialSelected = false;
  });
}

function getChildMapped(label: string, data: Project | Repos | Branch, type: TreeNodeTypes, key: string): TreeNode {
  return {
    label,
    data: {
      ...data,
      type,
    },
    key,
    expandedIcon: 'pi pi-folder-open',
    collapsedIcon: type === TreeNodeTypes.Branch ? 'pi pi-sitemap' : 'pi pi-folder',
    selectable: type === TreeNodeTypes.Branch,
    leaf: type !== TreeNodeTypes.Branch,
  };
}

@Component({
  selector: 'app-select-branch',
  templateUrl: './select-branch.component.html',
  styleUrls: ['./select-branch.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectBranchComponent {
  public projects: Project[] = [];
  public projectsTree: TreeNode[] = [];
  public projectTreeLoading = true;
  public frequentlyUsedBranches: FrequentlyUsedBranch[] = [];

  @ViewChild('projectTree')
  projectTreeComponent: any;

  @Output()
  public branchSelect = new EventEmitter<Branch | undefined>();

  constructor(
    private readonly bitbucketFoldersService: BitbucketFoldersService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.bitbucketFoldersService.getProjects()
      .pipe(
        finalize(() => {
          this.projectTreeLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe((response: Project[]) => {
        this.projects = response;
        this.projectsTree = this.projects.map((project: Project) => {
          return getChildMapped(project.name, project, TreeNodeTypes.Project, project.key);
        });
      });
    this.frequentlyUsedBranches = this.bitbucketFoldersService.getFrequentlyUsedBranch();
  }

  expandTreeNode(event: any, node: TreeNode): void {
    if (node.selectable) {
      return;
    }
    node.expanded = !node.expanded;
    event.node = node;
    this.projectsTreeNodeExpand(event);
  }

  selectNode(event: any, node: TreeNode): void {
    if (!node.selectable) {
      return;
    }
    node.partialSelected = !node.partialSelected;
    event.node = node;
    if (node.partialSelected) {
      if (node.parent != null) {
        clearSelected(node.key ? node.key : '', this.projectTreeComponent.serializedValue);
      }
      this.nodeSelect(event);
    } else {
      this.nodeUnselect(event);
    }
  }

  projectsTreeNodeExpand(event: any): void {
    const selectedNode: TreeNode = event.node;
    if (selectedNode.children != null) {
      return;
    }
    this.projectTreeLoading = true;
    this.getNodeChildren(selectedNode)
      .pipe(
        finalize(() => {
          this.projectTreeLoading = false;
          this.cdr.markForCheck();
        }),
      )
      .subscribe((response: TreeNode[]) => {
        selectedNode.children = response;
      });
  }

  nodeSelect(event: any): void {
    // event.node.collapsedIcon = 'pi pi-circle-on';
    const selectedNode = event.node;
    const selectedBranch: Branch = {
      ...selectedNode.data,
      project: selectedNode.parent.parent.data,
      repos: selectedNode.parent.data,
    };
    this.bitbucketFoldersService.setFrequentlyUsedBranch(selectedBranch);
    this.branchSelect.emit(selectedBranch);
  }

  nodeUnselect(event: any): void {
    // event.node.collapsedIcon = 'pi pi-circle-off';
    this.branchSelect.emit(undefined);
  }

  private getNodeChildren(selectedNode: TreeNode): Observable<TreeNode[]> {
    let $bitbucketService: Observable<TreeNode[]> = of();
    const type = selectedNode.data.type;
    if (type === TreeNodeTypes.Project) {
      const projectKey = selectedNode.key ? selectedNode.key : '';
      $bitbucketService = this.getRepos(projectKey);
    } else if (type === TreeNodeTypes.Repos) {
      const pKey = selectedNode.parent != null && selectedNode.parent.data != null ? selectedNode.parent.data.key : '';
      const rKey = selectedNode.data.slug != null ? selectedNode.data.slug : '';
      $bitbucketService = this.getBranches(pKey, rKey);
    }
    return $bitbucketService;
  }

  private getRepos(projectKey: string): Observable<TreeNode[]> {
    return this.bitbucketFoldersService.getRepos(projectKey).pipe(
      map((response: Repos[]) => {
        return response.map((repo: Repos) => {
          return getChildMapped(repo.name, repo, TreeNodeTypes.Repos, repo.key);
        });
      }));
  }

  private getBranches(projectKey: string, repoKey: string): Observable<TreeNode[]> {
    return this.bitbucketFoldersService.getBranches(projectKey, repoKey).pipe(map((response: any) => {
      return response.map((branch: Branch) => {
        return getChildMapped(branch.displayId, branch, TreeNodeTypes.Branch, branch.key);
      });
    }));
  }


}
