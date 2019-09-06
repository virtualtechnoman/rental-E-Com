import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { EventService } from '../shared/event-type.service';
import { Subject } from 'rxjs';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-marketing-material',
  templateUrl: './marketing-material.component.html',
  styleUrls: ['./marketing-material.component.scss']
})
export class MarketingMaterialComponent implements OnInit {

  marketingMaterialForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  viewArray:any=[];
  currentMarketingMaterial:any=[]
  currentMarketingMaterialId:string;
  currentIndex:number;
  allMarketingMaterial:any[]=[]

  constructor(private formBuilder: FormBuilder,private toastr:ToastrService,private eventService:EventService) {

    this.getMarketingMaterial();
   }

  ngOnInit() {

    this.marketingMaterialForm = this.formBuilder.group({
      name: ['', Validators.required],
  });
  this.dtOptions = {
    pagingType: 'full_numbers',
    lengthMenu: [
      [10, 15, 25, -1],
      [10, 15, 25, 'All']
    ],
    destroy: true,
    retrive: true,
    dom: '<"html5buttons"B>lTfgitp',
    language: {
      search: '_INPUT_',
      searchPlaceholder: 'Search records',
    },
    // dom: 'Bfrtip',
    buttons: [
      // 'colvis',
      'copy',
      'print',
      'excel',
    ]
  };
  }

  get f() { return this.marketingMaterialForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.marketingMaterialForm.invalid) {
        return;
    }

    if(this.editing){
      this.updateMarketingMaterial(this.marketingMaterialForm.value)
    }else{
      this.addMarketingMaterial(this.marketingMaterialForm.value)
    }
}

addMarketingMaterial(material){
  this.eventService.addMarketingMaterial(material).subscribe((res:ResponseModel)=>{
    console.log(res.data)
      jQuery('#modal3').modal('hide');
      this.toastr.success('Material Added', 'Success!');
      this.allMarketingMaterial.push(res.data)
      this.resetForm();
  })
}

updateMarketingMaterial(material) {
  const id = this.allMarketingMaterial[this.currentIndex]._id;
  // product._id = id;
  console.log(material);
  if(id)
  this.eventService.updateMarketingMaterial(material, id).subscribe((res: ResponseModel) => {
    jQuery('#modal3').modal('hide');
    this.toastr.info('Material Updated Successfully!', 'Updated!!');
    this.resetForm();
    this.allMarketingMaterial.splice(this.currentIndex, 1, res.data);
    this.currentMarketingMaterialId = null;
    this.editing = false;
  });
}

viewMarketingMaterial(i){
  this.viewArray=this.allMarketingMaterial[i];
  console.log(this.viewArray)
}

editMarketingMaterial(i){
  this.editing = true;
    this.currentMarketingMaterial = this.allMarketingMaterial[i];
    this.currentMarketingMaterialId = this.allMarketingMaterial[i]._id;
    this.currentIndex = i;
    this.setFormValue();

}
deleteMarketingMaterial(i){
  if (confirm('You Sure you want to delete this Material')) {
    this.eventService.deleteMarketingMaterial(this.allMarketingMaterial[i]._id).toPromise().then(() => {
      this.toastr.warning('Material Deleted!', 'Deleted!');
      this.allMarketingMaterial.splice(i, 1);
    }).catch((err) => console.log(err));
  }
}

setFormValue() {
  const material = this.allMarketingMaterial[this.currentIndex];
  this.marketingMaterialForm.controls['name'].setValue(material.name);
}

resetForm() {
  this.editing = false;
  this.submitted = false;
  this.marketingMaterialForm.reset();
  // this.initForm();
}

getMarketingMaterial(){
  this.eventService.getAllEvent().subscribe((res:ResponseModel)=>{
    this.allMarketingMaterial=res.data
    console.log(this.allMarketingMaterial)
    this.dtTrigger.next();
  })
}

}
