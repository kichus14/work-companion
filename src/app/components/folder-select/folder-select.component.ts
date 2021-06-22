import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {TreeNode} from 'primeng/api';
import {BitbucketFoldersService, Branch, BranchFile, FileType} from '../../services/bitbucket-folders.service';

function mapBranchToTreeNode(branchFiles: BranchFile[]): TreeNode[] {
  const sortedBranchFiles = branchFiles.sort(sortToDirectory);
  return sortedBranchFiles.map((branchFile) => {
    const children = branchFile.children != null ? mapBranchToTreeNode(branchFile.children) : [];
    const fileTree: TreeNode = {
      key: branchFile.path,
      label: branchFile.name,
      data: branchFile,
      children,
      expandedIcon: 'pi pi-folder-open',
      collapsedIcon: children.length > 0 ? 'pi pi-folder' : 'pi pi-file',
      leaf: children.length === 0,
    };
    return fileTree;
  });
}

function sortToDirectory(first: BranchFile, second: BranchFile): number {
  return first.type === FileType.directory ? -1 : 1 && (first.name.localeCompare(second.name));
}

function getFiles(selectedFiles: TreeNode[]): BranchFile[] {
  let files: BranchFile[] = [];
  selectedFiles.forEach((selectedFile) => {
    if (selectedFile.children != null && selectedFile.children.length > 0) {
      files = files.concat(getFiles(selectedFile.children));
    } else {
      const {children, ...file} = selectedFile.data;
      files.push(file);
    }
  });
  return files;
}

const FILE_EXT = 'pug';

@Component({
  selector: 'app-folder-select',
  templateUrl: './folder-select.component.html',
  styleUrls: ['./folder-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FolderSelectComponent implements OnChanges {
  @Input()
  branch?: Branch;
  @Input()
  foldersTree?: TreeNode[];
  @Input()
  fileExtension: string = FILE_EXT;
  @Output()
  selectedFiles = new EventEmitter<BranchFile[]>();
  @Output()
  selectedBranchFiles = new EventEmitter<TreeNode[]>();
  folderTreeLoading = false;
  folderFiles: TreeNode[] | undefined;
  branchFilesTree: TreeNode[] = [];

  constructor(
    private readonly bitbucketFoldersService: BitbucketFoldersService,
    private readonly cdr: ChangeDetectorRef,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.foldersTree == null) {
      this.getAllFiles();
    } else {
      this.branchFilesTree = this.foldersTree;
    }
  }

  get hasSelectedFiles(): boolean {
    return this.folderFiles == null || this.folderFiles.length === 0;
  }

  resetTree(): void {
    this.folderFiles = undefined;
  }

  goToNext(): void {
    if (this.folderFiles == null) {
      return;
    }
    const files = getFiles(this.folderFiles)
      .filter((currentFile, index, allFiles) =>
        allFiles.findIndex(nextFile => (nextFile.path === currentFile.path)) === index)
    .filter((file) => {
      return file.extension === this.fileExtension;
    });
    this.selectedFiles.emit(files);
  }

  private getAllFiles(): void {
    if (this.branch == null ||
      this.branch.project == null || this.branch.project.key == null ||
      this.branch.repos == null || this.branch.repos.slug == null
    ) {
      throw new Error('Branch, Project and Repo detail is required');
    }
    this.folderTreeLoading = true;
    const projectKey = this.branch.project.key;
    const repoKey = this.branch.repos.slug;
    this.bitbucketFoldersService.getFilesList(projectKey, repoKey, this.branch.displayId).subscribe((response) => {
      this.folderFiles = undefined;
      this.branchFilesTree = mapBranchToTreeNode(response);
      this.folderTreeLoading = false;
      this.cdr.markForCheck();
      this.selectedBranchFiles.emit(this.branchFilesTree);
    });
  }
}
