import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { CategoriesRoutingModule } from './categories-routing-module';
import { IonicModule } from '@ionic/angular';
import { CategoryListComponent } from './pages/category-list/category-list.component';
import { CategoryCardComponent } from './presentation/components/category-card/category-card.component';
import { CategoryFormComponent } from './presentation/components/category-form/category-form.component';
import { SharedModule } from '@shared/shared.module';

@NgModule({
  declarations: [CategoryListComponent, CategoryFormComponent, CategoryCardComponent],
  imports: [CommonModule, ReactiveFormsModule, IonicModule, CategoriesRoutingModule, SharedModule],
})
export class CategoriesModule {}
