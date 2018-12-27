import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewDetailPage } from './view-detail';

@NgModule({
  declarations: [
    ViewDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewDetailPage),
  ],
})
export class ViewDetailPageModule {}
