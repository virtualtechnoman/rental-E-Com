import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ProductsService } from '../shared/products.service';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { ResponseModel } from '../../../shared/shared.model';

@Component({
  selector: 'app-category-attributes',
  templateUrl: './category-attributes.component.html',
  styleUrls: ['./category-attributes.component.scss']
})
export class CategoryAttributesComponent implements OnInit {
  attributeForm: FormGroup;
  submitted = false;
  editing: Boolean = false;
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject();
  allCategory: any[] = [];
  allAttributes: any[] = [];
  viewArray: any = [];
  fileSelected: any;
  keyCategoryImage:any;
  urlCategoryImage:any;
  showImage:boolean=false;
  image:any;
  editShowImage:boolean=false
  editImage: any;
  mastImage: any;
  constructor(private formBuilder: FormBuilder, private productService: ProductsService, private toastr: ToastrService) {
    this.getCategory();
   }

  ngOnInit() {
    this.attributeForm=this.formBuilder.group({
      category:['',Validators.required],
      name:['',Validators.required],
      values:this.formBuilder.array([])
    })
  }

  get attributesForm() {
    return this.attributeForm.get('values') as FormArray
  }
  
  addAttribute() {
  
    const attibute = this.formBuilder.group({ 
      attibute: []
    })
  
    this.attributesForm.push(attibute);
  }
  
  deleteAttribute(i) {
    this.attributesForm.removeAt(i)
  }
  
  get f() { return this.attributeForm.controls; }

  submit(){
    
    if (this.attributeForm.invalid) {
      return;
    }
    for(var i=0;i<this.attributeForm.value.values.length;i++){
      this.attributeForm.value.values[i]=this.attributeForm.value.values[i].attibute
    }
    console.log(this.attributeForm.value)
    this.productService.addAttribute(this.attributeForm.value).subscribe((res:ResponseModel)=>{
      this.toastr.success('Attribute added!', 'Success!');
      this.allAttributes.push(res.data)
      console.log(res.data)
      jQuery('#modal3').modal('hide')
    })
  }

  getCategory() {
    this.allCategory.length = 0;
    this.productService.getAllCategory().subscribe((res: ResponseModel) => {
      this.allCategory = res.data;
      console.log(this.allCategory);
    });
  }

  resetForm(){
    this.submitted=false
    this.editing=false
    this.attributeForm.reset();
  }

}
