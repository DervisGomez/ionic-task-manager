import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { CATEGORIES_PROVIDERS } from '@features/categories/categories.providers';
import { TASKS_PROVIDERS } from '@features/tasks/tasks.providers';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    ...CATEGORIES_PROVIDERS,
    ...TASKS_PROVIDERS,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
