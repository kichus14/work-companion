import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {BlockUIModule} from 'primeng/blockui';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CheckboxModule} from 'primeng/checkbox';
import {FileUploadModule} from 'primeng/fileupload';
import {MessagesModule} from 'primeng/messages';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {RadioButtonModule} from 'primeng/radiobutton';
import {RippleModule} from 'primeng/ripple';
import {TreeModule} from 'primeng/tree';
import {FetchLiteralsComponent} from './fetch-literals/fetch-literals.component';
import {FolderSelectComponent} from './folder-select/folder-select.component';
import {LiteralsBaseComponent} from './literals-base/literals-base.component';
import {SelectBranchComponent} from './select-branch/select-branch.component';

@NgModule({
  declarations: [
    SelectBranchComponent,
    LiteralsBaseComponent,
    FolderSelectComponent,
    FetchLiteralsComponent,
  ],
  exports: [
    SelectBranchComponent,
    LiteralsBaseComponent,
    FolderSelectComponent,
    FetchLiteralsComponent
  ],
  imports: [
    CommonModule,
    CardModule,
    TreeModule,
    ButtonModule,
    FileUploadModule,
    MessagesModule,
    RadioButtonModule,
    FormsModule,
    CheckboxModule,
    BlockUIModule,
    ProgressSpinnerModule,
    RippleModule,
  ],
})
export class ComponentModule { }
