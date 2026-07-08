import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { PageHeaderComponent } from './components/page-header/page-header.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { CategoryFilterComponent } from './components/category-filter/category-filter.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { FloatingActionButtonComponent } from './components/floating-action-button/floating-action-button.component';

@NgModule({
  declarations: [
    PageHeaderComponent,
    SearchBarComponent,
    CategoryFilterComponent,
    EmptyStateComponent,
    FloatingActionButtonComponent,
  ],
  imports: [CommonModule, IonicModule],
  exports: [
    PageHeaderComponent,
    SearchBarComponent,
    CategoryFilterComponent,
    EmptyStateComponent,
    FloatingActionButtonComponent,
  ],
})
export class SharedModule {}
